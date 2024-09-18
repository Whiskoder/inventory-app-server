import { Router } from 'express'

import { Action, Resource } from '@config/roles'
import { AppDataSource } from '@core/datasources'
import { AuthMiddleware } from '@core/middlewares'
import { Restaurant } from '@modules/restaurant/models'
import { RestaurantService, RestaurantController } from '@modules/restaurant'

export class RestaurantRoutes {
  static get routes(): Router {
    const router = Router()

    const restaurantRepository = AppDataSource.getRepository(Restaurant)
    const restaurantService = new RestaurantService(restaurantRepository)
    const controller = new RestaurantController(restaurantService)

    const resource = Resource.RESTAURANT
    router.use(AuthMiddleware.validateToken)

    router.post(
      '',
      [AuthMiddleware.checkPermission(resource, Action.CREATE)],
      controller.createRestaurant
    )
    router.get(
      '',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getAllCategories
    )
    router.get(
      '/:term',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getRestaurantByTerm
    )
    router.put(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.UPDATE)],
      controller.updateRestaurant
    )
    router.delete(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.DELETE)],
      controller.deleteRestaurant
    )

    return router
  }
}
