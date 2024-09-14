import { Router } from 'express'
import { ProductController } from '@presentation/product/controller'
import { ProductService } from '@presentation/services'
import { AppDataSource } from '@db/datasources'
import { Product } from '@db/models'

export class ProductRoutes {
  static get routes(): Router {
    const router = Router()

    const productRepository = AppDataSource.getRepository(Product)
    const productService = new ProductService(productRepository)
    const controller = new ProductController(productService)

    // router.post('', controller.createCategory)
    // router.get('', controller.getAllCategories)
    // router.put('/:id', controller.updateCategory)
    // router.delete('/:id', controller.deleteCategory)

    return router
  }
}
