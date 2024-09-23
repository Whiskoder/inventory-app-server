import { Router } from 'express'

import { Action, Resource } from '@config/roles'
import { AuthMiddleware } from '@core/middlewares'
import { Order, OrderItem } from '@modules/order/models'
import { AppDataSource } from '@core/datasources'
import { OrderController, OrderService } from '@modules/order'
import { Branch } from '@modules/branch/models'

export class OrderRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const orderRepository = AppDataSource.getRepository(Order)
    const orderItemsRepository = AppDataSource.getRepository(OrderItem)
    const branchRepository = AppDataSource.getRepository(Branch)

    const orderService = new OrderService(
      orderRepository,
      orderItemsRepository,
      branchRepository
    )
    const controller = new OrderController(orderService)

    const resource = Resource.ORDER
    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Action.CREATE)],
      controller.createOrder
    )
    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getAllOrders
    )
    router.get(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getOrderById
    )
    router.put(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.UPDATE)],
      controller.updateOrder
    )
    router.delete(
      '/:id',
      [AuthMiddleware.checkPermission(resource, Action.DELETE)],
      controller.deleteOrder
    )

    return router
  }
}
