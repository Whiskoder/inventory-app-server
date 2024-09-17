/*
import { Router } from 'express'
import { CategoryController } from '@presentation/category/controller'
import { CategoryService } from '@presentation/services'
import { AppDataSource } from '@db/datasources'
import { Category } from '@db/models'

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()

    const categoryRepository = AppDataSource.getRepository(Category)
    const categoryService = new CategoryService(categoryRepository)
    const controller = new CategoryController(categoryService)

    router.post('', controller.createCategory)
    router.get('', controller.getAllCategories)
    router.put('/:id', controller.updateCategory)
    router.delete('/:id', controller.deleteCategory)

    return router
  }
}
	*/

/*
import { NextFunction, Request, Response } from 'express'
import { CategoryService } from '@presentation/services'

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //POST '/api/v1/auth/register'
  public registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // const dto = await RegisterUserDto.create(req.body)
      // const user = await this.authService.registerUser(dto)
      // res.json(user)
    } catch (e) {
      next(e)
    }
  }
}
*/

/*
import { Repository } from 'typeorm'
import { Category } from '@db/models'

export class CategoryService {
  constructor(private readonly categoryRepository: Repository<Category>) {}
}
*/
