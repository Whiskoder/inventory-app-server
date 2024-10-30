import { Router } from 'express'

import { Actions, Resources } from '@modules/user/enums'
import { AppDataSource } from '@core/datasources'
import { AuthMiddleware } from '@core/middlewares'
import { Branch } from '@modules/branch/models'
import { EmailService } from '@modules/emails/services'
import { envs } from '@config/plugins'
import { Order, OrderItem } from '@modules/order/models'
import { OrderController, OrderService } from '@modules/order'
import { Product } from '@modules/product/models'
import { User } from '@modules/user/models'

export class OrderRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const orderRepository = AppDataSource.getRepository(Order)
    const orderItemsRepository = AppDataSource.getRepository(OrderItem)
    const productRepository = AppDataSource.getRepository(Product)
    const branchRepository = AppDataSource.getRepository(Branch)
    const userRepository = AppDataSource.getRepository(User)

    const emailService = new EmailService({
      defaultSender: envs.MAILER_USER,
      mailerHost: envs.MAILER_HOST,
      mailerPort: envs.MAILER_PORT,
      mailerUser: envs.MAILER_USER,
      mailerPass: envs.MAILER_PASS,
      postToProvider: envs.SEND_EMAIL,
    })

    const orderService = new OrderService(
      orderRepository,
      orderItemsRepository,
      productRepository,
      branchRepository,
      userRepository,
      emailService
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
      '/:orderId/place',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.placeOrder
    )
    router.post(
      '/:orderId/accept',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.acceptOrder
    )
    router.post(
      '/:orderId/send',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.notifyOrderDelivery
    )
    router.post(
      '/:orderId/complete',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.completeOrder
    )
    router.post(
      '/:orderId/cancel',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.cancelOrder
    )
    router.post(
      '/:orderId/reject-cancel',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.rejectCancelOrder
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
      controller.createMultipleOrderItems
    )

    router.put(
      '/:orderId/items/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.updateMultipleOrderItems
    )

    router.delete(
      '/:orderId/items/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.deleteOrderItem
    )

    return router
  }
}
