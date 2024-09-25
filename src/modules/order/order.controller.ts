import { NextFunction, Request, Response } from 'express'
import { OrderService } from '@modules/order'
import { UpdateOrderDto, CreateOrderDto } from '@modules/order/dtos'
import { CreatePaginationDto } from '@modules/shared/dtos'

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //POST '/api/v1/order'
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

  //GET '/api/v1/order'
  public getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this.orderService.getAllOrders(res.locals.query)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/order/:id'
  public getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const response = await this.orderService.getOrderById(id)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //PUT '/api/v1/order/:id'
  public updateOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const user = res.locals.user
      const dto = await UpdateOrderDto.create(req.body)
      const response = await this.orderService.updateOrder(id, user, dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //DELETE '/api/v1/order/:id'
  public deleteOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const response = await this.orderService.deleteOrder(id)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
