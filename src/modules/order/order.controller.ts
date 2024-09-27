import { NextFunction, Request, Response } from 'express'
import { OrderService } from '@modules/order'
import {
  UpdateOrderDto,
  CreateOrderDto,
  RelationsOrderDto,
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from '@modules/order/dtos'
import { CreatePaginationDto, CreateSortingDto } from '@modules/shared/dtos'

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // POST '/api/v1/order/'
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

  // POST '/api/v1/order/:orderId/next/'
  public nextOrderStep = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const user = res.locals.user
      const response = await this.orderService.nextOrderStep(orderId, user)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // POST 'api/v1/order/:orderId/cancel/'
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

  // GET '/api/v1/order/'
  public getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const paginationDto = await CreatePaginationDto.create(req.query)
      const sortingDto = await CreateSortingDto.create(req.query)
      const response = await this.orderService.getAllOrders(
        paginationDto,
        sortingDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // GET '/api/v1/order/:orderId'
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

  // PUT '/api/v1/order/:orderId'
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

  // DELETE '/api/v1/order/:orderId'
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

  // POST '/api/v1/order/:orderId/items/'
  public createOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createOrderItemDto = await CreateOrderItemDto.create(req.body)
      const orderId = +req.params.orderId
      const response = await this.orderService.createOrderItem(
        createOrderItemDto,
        orderId
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // PUT '/api/v1/order/:orderId/items/:orderItemId'
  public updateOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updateOrderItemDto = await UpdateOrderItemDto.create(req.body)
      const orderId = +req.params.orderId
      const orderItemId = +req.params.orderItemId
      const response = await this.orderService.updateOrderItem(
        updateOrderItemDto,
        orderId,
        orderItemId
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // DELETE '/api/v1/order/:orderId/items/:orderItemId'
  public deleteOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = +req.params.orderId
      const orderItemId = +req.params.orderItemId
      const response = await this.orderService.deleteOrderItem(
        orderId,
        orderItemId
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
