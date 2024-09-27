import { Router } from 'express'

import { AppDataSource } from '@core/datasources'
import { Product, ProductPrice } from '@modules/product/models'
import { ProductController, ProductService } from '@modules/product'
import { Resources, Actions } from '@modules/user/enums'
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

    const resource = Resources.PRODUCT

    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.createProduct
    )

    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getAllProducts
    )

    router.get(
      '/:term',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getProductByTerm
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

    router.post(
      '/:productId/prices',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.createProductPrice
    )

    router.put(
      '/:productId/prices/:priceId',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.updateProductPrice
    )

    router.delete(
      '/:productId/prices/:priceId',
      [AuthMiddleware.checkPermission(resource, Actions.DELETE)],
      controller.deleteProductPrice
    )

    return router
  }
}
