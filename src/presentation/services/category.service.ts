import { Repository } from 'typeorm'
import { Category } from '@db/models'
import { CreateCategoryDto, UpdateCategoryDto } from '@domain/dtos/category'
import { BadRequestException, NotFoundException } from '@domain/errors'
import { CreatePaginationDto, HTTPResponseDto } from '@domain/dtos/shared'
import { PaginationDto } from '@domain/dtos/shared/pagination.dto'

export class CategoryService {
  constructor(private readonly categoryRepository: Repository<Category>) {}

  public async createCategory(createCategoryDto: CreateCategoryDto) {
    const isExistingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    })
    if (isExistingCategory)
      throw new BadRequestException('Category already exists')

    const category = await this.categoryRepository.save(createCategoryDto)

    return HTTPResponseDto.created('Category created succesfully', {
      categories: [category],
    })
  }

  public async getAllCategories(createPaginationDto: CreatePaginationDto) {
    const { limit, skip, page: currentPage } = createPaginationDto
    const [categories, totalItems] = await this.categoryRepository.findAndCount(
      {
        take: limit,
        skip,
      }
    )

    const pagination = new PaginationDto({ limit, currentPage, totalItems })

    if (!totalItems) throw new NotFoundException('No categories found')
    if (totalItems < createPaginationDto.skip)
      throw new BadRequestException(
        `Page out of range, total pages: ${pagination.totalPages} `
      )

    return HTTPResponseDto.ok(undefined, { categories, pagination })
  }

  public async getCategoryById(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } })
    if (!category) throw new NotFoundException('Category not found')
    return HTTPResponseDto.ok(undefined, { categories: [category] })
  }

  public async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ) {
    const isExistingCategory = await this.categoryRepository.findOne({
      where: { id },
    })
    if (!isExistingCategory) throw new NotFoundException('Category not found')

    await this.categoryRepository.update(id, updateCategoryDto)

    return HTTPResponseDto.ok('Category updated successfully')
  }

  // TODO: disable category instead of deleting
  public async deleteCategory(id: number) {
    const deleteCategory = await this.categoryRepository.delete(id)

    if (!deleteCategory.affected)
      throw new NotFoundException('Category not found')

    return HTTPResponseDto.noContent('Category deleted successfully')
  }
}
