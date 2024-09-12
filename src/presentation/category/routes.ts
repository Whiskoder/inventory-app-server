import { Router } from 'express'
import { CategoryController } from '@presentation/category/controller'
import { CategoryService } from '@presentation/services'
import { AppDataSource } from '@db/datasources'
import { Category } from '@db/models'
import { AuthMiddleware } from '@presentation/middlewares'

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router()

    const categoryRepository = AppDataSource.getRepository(Category)
    const categoryService = new CategoryService(categoryRepository)
    const controller = new CategoryController(categoryService)

    // TODO: create a middleware for authorization role based
    router.use(AuthMiddleware.validateToken)
    router.post('', controller.createCategory)
    router.get('', controller.getAllCategories)
    router.get('/:id', controller.getCategoryById)
    router.put('/:id', controller.updateCategory)
    router.delete('/:id', controller.deleteCategory)

    return router
  }
}
