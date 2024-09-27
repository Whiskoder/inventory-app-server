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

  //GET '/api/v1/categories/'
  public getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const paginationDto = await CreatePaginationDto.create(req.query)
      const sortingDto = await CreateSortingDto.create(req.query)
      const response = await this.categoryService.getAllCategories(
        paginationDto,
        sortingDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/categories/:term'
  public getCategoryByTerm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const relationsDto = await RelationsCategoryDto.create(req.query)
      const response = await this.categoryService.getCategoryByTerm(
        req.params.term,
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
