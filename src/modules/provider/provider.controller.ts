import { NextFunction, Request, Response } from 'express'

import { ProviderService } from '@modules/provider'
import {
  CreateProviderDto,
  RelationsProviderDto,
  UpdateProviderDto,
} from '@modules/provider/dtos'
import { CreatePaginationDto, CreateSortingDto } from '@modules/shared/dtos'

export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  //POST '/api/v1/providers/'
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

  //GET '/api/v1/providers/'
  public getAllProviders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const paginationDto = await CreatePaginationDto.create(req.query)
      const props = ['']
      const sortingDto = await CreateSortingDto.create(req.query, props)
      const response = await this.providerService.getAllProviders(
        paginationDto,
        sortingDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/providers/:term'
  public getProviderByTerm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const relationsDto = await RelationsProviderDto.create(req.query)
      const term = req.params.term
      const response = await this.providerService.getProviderByTerm(
        term,
        relationsDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //PUT '/api/v1/providers/:providerId'
  public updateProvider = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const providerId = +req.params.providerId
      const dto = await UpdateProviderDto.create(req.body)
      const response = await this.providerService.updateProvider(
        providerId,
        dto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //DELETE '/api/v1/providers/:providerId'
  public deleteProvider = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const providerId = +req.params.providerId
      const response = await this.providerService.deleteProvider(providerId)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
