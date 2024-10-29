import { NextFunction, Request, Response } from 'express'

import { BrandService } from '@modules/brand'
import {
  CreateBrandDto,
  UpdateBrandDto,
  RelationsBrandDto,
  FilterBrandDto,
} from '@modules/brand/dtos'
import { CreatePaginationDto, CreateSortingDto } from '@modules/shared/dtos'

export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  //POST '/api/v1/brands/'
  public createBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createbrandDto = await CreateBrandDto.create(req.body)
      const response = await this.brandService.createBrand(createbrandDto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/brands/:brandId'
  public getBrandById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const brandId = +req.params.brandId
      const relationsDto = await RelationsBrandDto.create(req.query)
      const response = await this.brandService.getBrandById(
        brandId,
        relationsDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // GET '/api/v1/brands/'
  public getBrandList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sortingProps = ['name']
      const paginationDto = await CreatePaginationDto.create(req.query)
      const relationsDto = await RelationsBrandDto.create(req.query)
      const sortingDto = await CreateSortingDto.create(req.query, sortingProps)
      const filterDto = await FilterBrandDto.create(req.query)
      const response = await this.brandService.getBrandList(
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

  //PUT '/api/v1/brands/:brandId'
  public updateBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const brandId = +req.params.brandId
      const updatebrandDto = await UpdateBrandDto.create(req.body)
      const response = await this.brandService.updateBrand(
        brandId,
        updatebrandDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //DELETE '/api/v1/brands/:brandId'
  public deleteBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const brandId = +req.params.brandId
      const response = await this.brandService.deleteBrand(brandId)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
