import { Router } from 'express'

import { AppDataSource } from '@core/datasources'
import { Product } from '@modules/product/models'
import { ProductController, ProductService } from '@modules/product'
import { Resources, Actions } from '@modules/user/enums'
import { AuthMiddleware } from '@core/middlewares'

export class ProductRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const productRepository = AppDataSource.getRepository(Product)

    const productService = new ProductService(productRepository)
    const controller = new ProductController(productService)

    const resource = Resources.PRODUCT

    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.createProduct
    )

    router.post(
      '/excel',
      [
        AuthMiddleware.checkPermission(resource, Actions.CREATE),
        // AuthMiddleware.checkPermission(resource, Actions.UPDATE),
      ],
      controller.importExcel
    )

    router.get(
      '/:productId',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getProductById
    )

    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getProductList
    )

    router.put(
      '/:productId',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.updateProduct
    )

    router.delete(
      '/:productId',
      [AuthMiddleware.checkPermission(resource, Actions.DELETE)],
      controller.deleteProduct
    )

    return router
  }
}
