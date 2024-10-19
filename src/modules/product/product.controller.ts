import { NextFunction, Request, Response } from 'express'

import { ProductService } from '@modules/product'
import {
  CreateProductDto,
  FilterProductDto,
  RelationsProductDto,
  UpdateProductDto,
} from '@modules/product/dtos'
import { CreatePaginationDto, CreateSortingDto } from '@modules/shared/dtos'

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // POST '/api/v1/products/'
  public createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await CreateProductDto.create(req.body)
      const response = await this.productService.createProduct(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // GET '/api/v1/products/:productId'
  public getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = +req.params.productId
      const relationsDto = await RelationsProductDto.create(req.query)
      const response = await this.productService.getProductById(
        productId,
        relationsDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // GET '/api/v1/products'
  public getProductList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const paginationDto = await CreatePaginationDto.create(req.query)
      const relationsDto = await RelationsProductDto.create(req.query)
      const sortingProps = [
        'category',
        'name',
        'brand',
        'pricePerUnit',
        'minUnits',
        'measureUnit',
      ]
      const sortingDto = await CreateSortingDto.create(req.query, sortingProps)
      const filterDto = await FilterProductDto.create(req.query)
      const response = await this.productService.getProductList(
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

  // PUT '/api/v1/products/:productId'
  public updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = +req.params.productId
      const dto = await UpdateProductDto.create(req.body)
      const response = await this.productService.updateProduct(productId, dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // DELETE '/api/v1/products/:productId'
  public deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = +req.params.productId
      const response = await this.productService.deleteProduct(productId)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
