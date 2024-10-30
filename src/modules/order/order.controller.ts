import { NextFunction, Request, Response } from 'express'
import { OrderService } from '@modules/order'
import {
  UpdateOrderDto,
  CreateOrderDto,
  RelationsOrderDto,
  CreateOrderItemDto,
  UpdateOrderItemDto,
  FilterOrderDto,
  CreateMultipleOrderItemsDto,
} from '@modules/order/dtos'
import { CreatePaginationDto, CreateSortingDto } from '@modules/shared/dtos'
import { UpdateMultipleOrderItemsDto } from './dtos/update-multiple-order-items.dto'
import { DeleteMultipleOrderItemsDto } from './dtos/delete-multiple-order-items.dto'

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // POST '/v1/order/'
  public createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await CreateOrderDto.create(req.body)
      const user = res.locals.user
      const response = await this.orderService.createOrder(dto, user)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // POST '/v1/order/:orderId/place/'
  public placeOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const user = res.locals.user
      const response = await this.orderService.placeOrder(orderId, user)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
  // POST '/v1/order/:orderId/accept/'
  public acceptOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const user = res.locals.user
      const response = await this.orderService.acceptOrder(orderId, user)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
  // POST '/v1/order/:orderId/send/'
  public notifyOrderDelivery = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const user = res.locals.user
      const response = await this.orderService.notifyOrderDelivery(
        orderId,
        user
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
  // POST '/v1/order/:orderId/complete/'
  public completeOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const user = res.locals.user
      const response = await this.orderService.completeOrder(orderId, user)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
  // POST '/v1/order/:orderId/cancel/'
  public cancelOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const user = res.locals.user
      const response = await this.orderService.cancelOrder(orderId, user)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
  // POST '/v1/order/:orderId/reject-cancel/'
  public rejectCancelOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const user = res.locals.user
      const response = await this.orderService.rejectCancelOrder(orderId, user)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // GET '/v1/order/'
  public getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sortingProps = [
        'completedAt',
        'createdAt',
        'deliveryDate',
        'status',
        'totalPriceAmount',
        'totalItems',
      ]
      const paginationDto = await CreatePaginationDto.create(req.query)
      const sortingDto = await CreateSortingDto.create(req.query, sortingProps)
      const filterDto = await FilterOrderDto.create(req.query)
      const relationsDto = await RelationsOrderDto.create(req.query)
      const response = await this.orderService.getOrderList(
        paginationDto,
        sortingDto,
        relationsDto,
        filterDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // GET '/v1/order/:orderId'
  public getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const relationsDto = await RelationsOrderDto.create(req.query)
      const response = await this.orderService.getOrderById(
        orderId,
        relationsDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // PUT '/v1/order/:orderId'
  public updateOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const user = res.locals.user
      const dto = await UpdateOrderDto.create(req.body)
      const response = await this.orderService.updateOrder(orderId, user, dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // DELETE '/v1/order/:orderId'
  public deleteOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const response = await this.orderService.deleteOrder(orderId)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // POST '/v1/order/:orderId/items/'
  public createMultipleOrderItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createOrderItemDtos = await CreateMultipleOrderItemsDto.create(
        req.body
      )
      const orderId = +req.params.orderId
      const response = await this.orderService.createMultipleOrderItems(
        createOrderItemDtos,
        orderId
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // PUT '/v1/order/:orderId/items/'
  public updateMultipleOrderItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updateOrderItemDtos = await UpdateMultipleOrderItemsDto.create(
        req.body
      )
      const orderId = +req.params.orderId
      const response = await this.orderService.updateMultipleOrderItems(
        updateOrderItemDtos,
        orderId
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // DELETE '/v1/order/:orderId/items/:orderItemId'
  public deleteOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const deleteMultipleOrderItemsDto =
        await DeleteMultipleOrderItemsDto.create(req.query)
      const response = await this.orderService.deleteOrderItem(
        orderId,
        deleteMultipleOrderItemsDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
