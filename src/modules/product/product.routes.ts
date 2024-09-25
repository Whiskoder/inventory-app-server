import { Router } from 'express'

import { AppDataSource } from '@core/datasources'
import { Product, ProductPrice } from '@modules/product/models'
import { ProductController, ProductService } from '@modules/product'
import { Resource, Action } from '@config/roles'
import { AuthMiddleware } from '@core/middlewares'
import { Category } from '@modules/category/models'
import { Provider } from '@modules/provider/models'

export class ProductRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const productRepository = AppDataSource.getRepository(Product)
    const productPriceRepository = AppDataSource.getRepository(ProductPrice)
    const providerRepository = AppDataSource.getRepository(Provider)
    const categoryRepository = AppDataSource.getRepository(Category)

    const productService = new ProductService(
      productRepository,
      productPriceRepository,
      providerRepository,
      categoryRepository
    )
    const controller = new ProductController(productService)

    const resource = Resource.PRODUCT

    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Action.CREATE)],
      controller.createProduct
    )

    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getAllProducts
    )

    router.get(
      '/:term',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getProductByTerm
    )

    router.put(
      '/:productId',
      [AuthMiddleware.checkPermission(resource, Action.UPDATE)],
      controller.updateProduct
    )

    router.delete(
      '/:productId',
      [AuthMiddleware.checkPermission(resource, Action.DELETE)],
      controller.deleteProduct
    )

    router.post(
      '/:productId/prices',
      [AuthMiddleware.checkPermission(resource, Action.CREATE)],
      controller.createProductPrice
    )

    router.get(
      '/:productId/prices',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getProductPricesByProductId
    )

    router.put(
      '/:productId/prices/:priceId',
      [AuthMiddleware.checkPermission(resource, Action.UPDATE)],
      controller.updateProductPrice
    )

    router.delete(
      '/:productId/prices/:priceId',
      [AuthMiddleware.checkPermission(resource, Action.DELETE)],
      controller.deleteProductPrice
    )

    return router
  }
}
