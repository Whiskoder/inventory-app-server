import { Router } from 'express'

import { Actions, Resources } from '@modules/user/enums'
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

    const resource = Resources.PROVIDER
    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.createProvider
    )

    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getProviderList
    )

    router.get(
      '/:providerId',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getProviderById
    )

    router.put(
      '/:providerId',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.updateProvider
    )

    router.delete(
      '/:providerId',
      [AuthMiddleware.checkPermission(resource, Actions.DELETE)],
      controller.deleteProvider
    )

    return router
  }
}
