import { Repository } from 'typeorm'

import { HTTPResponseDto, PaginationDto } from '@modules/shared/dtos'
import { BadRequestException, NotFoundException } from '@core/errors'
import { Category } from '@modules/category/models'
import { CreateCategoryDto, UpdateCategoryDto } from '@modules/category/dtos'

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

  public async getAllCategories(paginationDto: PaginationDto) {
    const { limit, skip, page: currentPage } = paginationDto
    const [categories, totalItems] = await this.categoryRepository.findAndCount(
      {
        take: limit,
        skip,
      }
    )

    const pagination = PaginationDto.calculate({
      limit,
      currentPage,
      totalItems,
    })

    if (!totalItems) throw new NotFoundException('No categories found')
    if (totalItems < paginationDto.skip)
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
