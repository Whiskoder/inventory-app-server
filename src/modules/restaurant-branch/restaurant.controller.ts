import { NextFunction, Request, Response } from 'express'
import { RestaurantService } from '@modules/restaurant'
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from '@modules/restaurant/dtos'
import { PaginationDto } from '@modules/shared/dtos'

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  //POST '/api/v1/restaurant'
  public createRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await CreateRestaurantDto.create(req.body)
      const response = await this.restaurantService.createRestaurant(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/restaurant'
  public getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await PaginationDto.create(req.query)
      const response = await this.restaurantService.getAllCategories(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/restaurant/:id'
  public getRestaurantByTerm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this.restaurantService.getRestaurantByTerm(
        req.params.term
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //PUT '/api/v1/restaurant/:id'
  public updateRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const dto = await UpdateRestaurantDto.create(req.body)
      const response = await this.restaurantService.updateRestaurant(id, dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //DELETE '/api/v1/restaurant/:id'
  public deleteRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const response = await this.restaurantService.deleteRestaurant(id)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
