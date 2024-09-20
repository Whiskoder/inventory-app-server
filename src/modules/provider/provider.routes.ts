import { Router } from 'express'

import { Action, Resource } from '@config/roles'
import { AuthMiddleware } from '@core/middlewares'
import { AppDataSource } from '@core/datasources'
import { Provider } from '@modules/provider/models'
import { ProviderService, ProviderController } from '@modules/provider'

export class ProviderRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const providerRepository = AppDataSource.getRepository(Provider)
    const providerService = new ProviderService(providerRepository)
    const controller = new ProviderController(providerService)

    const resource = Resource.PROVIDER
    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Action.CREATE)],
      controller.createProvider
    )
    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getAllProviders
    )
    router.get(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getProviderById
    )
    router.put(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.UPDATE)],
      controller.updateProvider
    )
    router.delete(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.DELETE)],
      controller.deleteProvider
    )

    return router
  }
}
