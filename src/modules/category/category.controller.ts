import { NextFunction, Request, Response } from 'express'

import { CategoryService } from '@modules/category'
import { CreateCategoryDto, UpdateCategoryDto } from '@modules/category/dtos'
import { PaginationDto } from '@modules/shared/dtos'

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //POST '/api/v1/category/'
  public createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await CreateCategoryDto.create(req.body)
      const response = await this.categoryService.createCategory(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/category/'
  public getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await PaginationDto.create(req.query)
      const response = await this.categoryService.getAllCategories(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/category/:id'
  public getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const response = await this.categoryService.getCategoryById(id)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //PUT '/api/v1/category/:id'
  public updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const dto = await UpdateCategoryDto.create(req.body)
      const response = await this.categoryService.updateCategory(id, dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //DELETE '/api/v1/category/:id'
  public deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const response = await this.categoryService.deleteCategory(id)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
