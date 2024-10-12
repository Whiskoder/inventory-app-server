import { Router } from 'express'

import { CategoryService, CategoryController } from '@modules/category'
import { AppDataSource } from '@core/datasources'
import { Category } from '@modules/category/models'
import { AuthMiddleware } from '@core/middlewares'
import { Actions, Resources } from '@modules/user/enums'

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const categoryRepository = AppDataSource.getRepository(Category)
    const categoryService = new CategoryService(categoryRepository)
    const controller = new CategoryController(categoryService)

    const resource = Resources.CATEGORY

    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.createCategory
    )

    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.searchCategoriesByTerm
    )

    router.get(
      '/:term',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.searchCategoriesByTerm
    )

    router.put(
      '/:categoryId',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.updateCategory
    )

    router.delete(
      '/:categoryId',
      [AuthMiddleware.checkPermission(resource, Actions.DELETE)],
      controller.deleteCategory
    )
    return router
  }
}
