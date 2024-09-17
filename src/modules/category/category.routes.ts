import { Router } from 'express'

import { CategoryService, CategoryController } from '@modules/category'
import { AppDataSource } from '@core/datasources'
import { Category } from '@modules/category/models'
import { AuthMiddleware } from '@core/middlewares'
import { Action, Resource } from '@config/roles'

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router()

    const categoryRepository = AppDataSource.getRepository(Category)
    const categoryService = new CategoryService(categoryRepository)
    const controller = new CategoryController(categoryService)

    const resource = Resource.CATEGORY

    // TODO: Simplify the process to add roles and permissions
    // TODO: Refactor and move to AuthMiddleware
    router.use(AuthMiddleware.validateToken)
    router.post(
      '',
      [AuthMiddleware.checkPermission(resource, Action.CREATE)],
      controller.createCategory
    )
    router.get('', controller.getAllCategories)
    router.get('/:id', controller.getCategoryById)
    router.put('/:id', controller.updateCategory)
    router.delete('/:id', controller.deleteCategory)

    return router
  }
}
