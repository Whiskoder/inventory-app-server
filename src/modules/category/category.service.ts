import { Repository } from 'typeorm'

import {
  CreateHTTPResponseDto,
  CreatePaginationDto,
  CreateSortingDto,
} from '@modules/shared/dtos'
import { InternalServerErrorException, NotFoundException } from '@core/errors'
import { Category } from '@modules/category/models'
import {
  CreateCategoryDto,
  RelationsCategoryDto,
  UpdateCategoryDto,
} from '@modules/category/dtos'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'
import { UUID } from '@config/plugins'

export class CategoryService {
  constructor(private readonly categoryRepository: Repository<Category>) {}

  public async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<CreateHTTPResponseDto> {
    const categoryEntity = this.categoryRepository.create(createCategoryDto)
    await this.categoryRepository.save(categoryEntity)

    return CreateHTTPResponseDto.created('Category created succesfully', {
      categories: [categoryEntity],
    })
  }

  public async getAllCategories(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const { sortBy = 'id', orderBy } = sortingDto

    const [categories, totalItems] = await this.categoryRepository.findAndCount(
      {
        take: limit,
        skip,
        where: { isActive: true },
        order: { [sortBy]: orderBy },
      }
    )

    const pagination = CalculatePaginationUseCase.execute({
      currentPage,
      limit,
      totalItems,
    })

    return CreateHTTPResponseDto.ok(undefined, { categories, pagination })
  }

  public async getCategoryByTerm(
    term: string,
    relationsDto: RelationsCategoryDto
  ): Promise<CreateHTTPResponseDto> {
    let categoryEntity
    if (Number(term)) {
      categoryEntity = await this.categoryRepository.findOne({
        where: { id: +term, isActive: true },
        relations: [...relationsDto.include],
      })
    } else {
      categoryEntity = await this.categoryRepository.findOne({
        where: { name: term.toLowerCase(), isActive: true },
        relations: [...relationsDto.include],
      })
    }

    if (!categoryEntity) throw new NotFoundException('Category not found')
    return CreateHTTPResponseDto.ok(undefined, { categories: [categoryEntity] })
  }

  public async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<CreateHTTPResponseDto> {
    const categoryEntity = this.categoryRepository.create(updateCategoryDto)
    const updatedCategory = await this.categoryRepository.update(
      { isActive: true, id: categoryId },
      categoryEntity
    )

    if (!updatedCategory.affected)
      throw new NotFoundException('Category not found')

    return CreateHTTPResponseDto.ok('Category updated successfully')
  }

  public async deleteCategory(
    categoryId: number
  ): Promise<CreateHTTPResponseDto> {
    const categoryEntity = await this.categoryRepository.findOne({
      where: { id: categoryId, isActive: true },
    })

    if (!categoryEntity) throw new NotFoundException('Category not found')
    const name = categoryEntity.name + '_' + UUID.nanoid()
    const deletedCategory = await this.categoryRepository.update(
      { id: categoryId },
      { isActive: false, name }
    )

    if (!deletedCategory.affected)
      throw new InternalServerErrorException('Error deleting category')

    return CreateHTTPResponseDto.noContent()
  }
}
