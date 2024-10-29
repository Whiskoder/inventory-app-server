import { NextFunction, Request, Response } from 'express'

import { ProviderService } from '@modules/provider'
import {
  CreateProviderDto,
  FilterProviderDto,
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

  //GET '/api/v1/providers/:providerId'
  public getProviderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const providerId = +req.params.providerId
      const relationsDto = await RelationsProviderDto.create(req.query)
      const response = await this.providerService.getProviderById(
        providerId,
        relationsDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/providers/'
  public getProviderList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const props = [
        'cityName',
        'contactEmail',
        'contactPhone',
        'dependantLocality',
        'name',
        'postalCode',
        'streetName',
        'rfc',
      ]
      const paginationDto = await CreatePaginationDto.create(req.query)
      const sortingDto = await CreateSortingDto.create(req.query, props)
      const relationsDto = await RelationsProviderDto.create(req.query)
      const filterDto = await FilterProviderDto.create(req.query)

      const response = await this.providerService.getProviderList(
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
