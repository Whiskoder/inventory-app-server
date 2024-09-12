import { NextFunction, Request, Response } from 'express'
import { CategoryService } from '@presentation/services'
import { CreateCategoryDto, UpdateCategoryDto } from '@domain/dtos/category'
import { CreatePaginationDto } from '@domain/dtos/shared'
import { plainToClass, plainToInstance } from 'class-transformer'

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
      const category = await this.categoryService.createCategory(dto)
      res.json(category)
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
      const dto = await CreatePaginationDto.create(req.query)
      const categories = await this.categoryService.getAllCategories(dto)
      res.json(categories)
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
      const categories = await this.categoryService.getCategoryById(id)
      res.json(categories)
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
      const category = await this.categoryService.updateCategory(id, dto)
      res.json(category)
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
      const category = await this.categoryService.deleteCategory(id)
      res.json(category)
    } catch (e) {
      next(e)
    }
  }
}
