import { NextFunction, Request, Response } from 'express'

import { ProviderService } from '@modules/provider'
import { CreateProviderDto, UpdateProviderDto } from '@modules/provider/dtos'
import { PaginationDto } from '@modules/shared/dtos'

export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  //POST '/api/v1/provider'
  public createProvider = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await CreateProviderDto.create(req.body)
      const response = await this.providerService.createProvider(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/provider'
  public getAllProviders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await PaginationDto.create(req.query)
      const response = await this.providerService.getAllProviders(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/provider/:id'
  public getProviderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const response = await this.providerService.getProviderById(id)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //PUT '/api/v1/provider/:id'
  public updateProvider = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const dto = await UpdateProviderDto.create(req.body)
      const response = await this.providerService.updateProvider(id, dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //DELETE '/api/v1/provider/:id'
  public deleteProvider = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const response = await this.providerService.deleteProvider(id)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
