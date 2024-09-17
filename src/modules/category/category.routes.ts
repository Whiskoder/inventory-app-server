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

    router.use(AuthMiddleware.validateToken)

    router.post(
      '',
      [AuthMiddleware.checkPermission(resource, Action.CREATE)],
      controller.createCategory
    )

    router.get(
      '',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getAllCategories
    )

    router.get(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getCategoryById
    )

    router.put(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.UPDATE)],
      controller.updateCategory
    )

    router.delete(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.DELETE)],
      controller.deleteCategory
    )
    return router
  }
}
