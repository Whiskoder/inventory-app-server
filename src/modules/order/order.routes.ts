import { Router } from 'express'

import { Actions, Resources } from '@modules/user/enums'
import { AuthMiddleware } from '@core/middlewares'
import { Order, OrderItem } from '@modules/order/models'
import { AppDataSource } from '@core/datasources'
import { OrderController, OrderService } from '@modules/order'
import { Branch } from '@modules/branch/models'
import { ProductPrice } from '../product/models'

export class OrderRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const orderRepository = AppDataSource.getRepository(Order)
    const orderItemsRepository = AppDataSource.getRepository(OrderItem)
    const productPriceRepository = AppDataSource.getRepository(ProductPrice)
    const branchRepository = AppDataSource.getRepository(Branch)

    const orderService = new OrderService(
      orderRepository,
      orderItemsRepository,
      productPriceRepository,
      branchRepository
    )
    const controller = new OrderController(orderService)

    const resource = Resources.ORDER
    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.createOrder
    )

    router.post(
      '/:orderId/next',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.nextOrderStep
    )

    router.post(
      '/:orderId/cancel',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.cancelOrder
    )

    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getAllOrders
    )

    router.get(
      '/:orderId',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getOrderById
    )

    router.put(
      '/:orderId',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.updateOrder
    )

    router.delete(
      '/:orderId',
      [AuthMiddleware.checkPermission(resource, Actions.DELETE)],
      controller.deleteOrder
    )

    router.post(
      '/:orderId/items/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.createOrderItem
    )

    router.put(
      '/:orderId/items/:orderItemId',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.updateOrderItem
    )

    router.delete(
      '/:orderId/items/:orderItemId',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.deleteOrderItem
    )

    return router
  }
}
