import { Repository } from 'typeorm'

import { HTTPResponseDto, PaginationDto } from '@modules/shared/dtos'
import { BadRequestException, NotFoundException } from '@core/errors'
import { Category } from '@modules/category/models'
import { CreateCategoryDto, UpdateCategoryDto } from '@modules/category/dtos'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'

export class CategoryService {
  constructor(private readonly categoryRepository: Repository<Category>) {}

  public async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<HTTPResponseDto> {
    const isExistingCategory = await this.categoryRepository.update(
      { name: createCategoryDto.name, isActive: false },
      { isActive: true }
    )

    if (isExistingCategory.affected === 1)
      return HTTPResponseDto.accepted(
        `Category ${createCategoryDto.name} already exists`
      )

    const categoryEntity = this.categoryRepository.create(createCategoryDto)
    await this.categoryRepository.save(categoryEntity)

    return HTTPResponseDto.created('Category created succesfully', {
      categories: [categoryEntity],
    })
  }

  public async getAllCategories(
    paginationDto: PaginationDto
  ): Promise<HTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const [categories, totalItems] = await this.categoryRepository.findAndCount(
      {
        take: limit,
        skip,
        where: { isActive: true },
      }
    )

    const pagination = CalculatePaginationUseCase.execute({
      currentPage,
      limit,
      totalItems,
      skip,
    })

    return HTTPResponseDto.ok(undefined, { categories, pagination })
  }

  public async getCategoryByTerm(term: string): Promise<HTTPResponseDto> {
    let category

    if (Number(term)) {
      category = await this.categoryRepository.findOne({
        where: { id: +term, isActive: true },
      })
    } else {
      category = await this.categoryRepository.findOne({
        where: { name: term.toLowerCase(), isActive: true },
      })
    }

    if (!category) throw new NotFoundException('Category not found')
    return HTTPResponseDto.ok(undefined, { categories: [category] })
  }

  public async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<HTTPResponseDto> {
    const categoryEntity = this.categoryRepository.create(updateCategoryDto)
    const updateCategory = await this.categoryRepository.update(
      { isActive: true, id },
      categoryEntity
    )

    if (!updateCategory.affected)
      throw new NotFoundException('Category not found')

    return HTTPResponseDto.ok('Category updated successfully')
  }

  public async deleteCategory(id: number): Promise<HTTPResponseDto> {
    const deleteCategory = await this.categoryRepository.update(id, {
      isActive: false,
    })

    if (!deleteCategory.affected)
      throw new NotFoundException('Category not found')

    return HTTPResponseDto.noContent()
  }
}
