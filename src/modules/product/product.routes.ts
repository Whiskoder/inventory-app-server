import { Router } from 'express'

import { AppDataSource } from '@core/datasources'
import { Product } from '@modules/product/models'
import { ProductController, ProductService } from '@modules/product'

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
