import { Router } from 'express'

import { Actions, Resources } from '@modules/user/enums'
import { AppDataSource } from '@core/datasources'
import { AuthMiddleware } from '@core/middlewares'
import { Brand } from '@modules/brand/models'
import { BrandController, BrandService } from '@modules/brand'

export class BrandRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const brandRepository = AppDataSource.getRepository(Brand)
    const brandService = new BrandService(brandRepository)
    const controller = new BrandController(brandService)

    const resource = Resources.BRANCH
    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.createBrand
    )

    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getAllBrands
    )

    router.get(
      '/:term',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getAllBrands
    )

    router.put(
      '/:brandId',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.updateBrand
    )

    router.delete(
      '/:brandId',
      [AuthMiddleware.checkPermission(resource, Actions.DELETE)],
      controller.deleteBrand
    )

    return router
  }
}
