import { NextFunction, Request, Response } from 'express'

import { CategoryService } from '@modules/category'
import {
  CreateCategoryDto,
  RelationsCategoryDto,
  UpdateCategoryDto,
} from '@modules/category/dtos'
import { CreatePaginationDto, CreateSortingDto } from '@modules/shared/dtos'

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //POST '/api/v1/categories/'
  public createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createCategoryDto = await CreateCategoryDto.create(req.body)
      const response = await this.categoryService.createCategory(
        createCategoryDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/categories/:term'
  public searchCategoriesByTerm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sortingProps = ['name']
      const paginationDto = await CreatePaginationDto.create(req.query)
      const sortingDto = await CreateSortingDto.create(req.query, sortingProps)
      const relationsDto = await RelationsCategoryDto.create(req.query)
      const term = req.params.term

      const response = await this.categoryService.searchCategoriesByTerm(
        term,
        paginationDto,
        sortingDto,
        relationsDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //PUT '/api/v1/categories/:categoryId'
  public updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const categoryId = +req.params.categoryId
      const updateCategoryDto = await UpdateCategoryDto.create(req.body)
      const response = await this.categoryService.updateCategory(
        categoryId,
        updateCategoryDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //DELETE '/api/v1/categories/:categoryId'
  public deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const categoryId = +req.params.categoryId
      const response = await this.categoryService.deleteCategory(categoryId)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
