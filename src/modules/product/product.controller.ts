import { NextFunction, Request, Response } from 'express'

import { ProductService } from '@modules/product'
import {
  CreateProductDto,
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

  // GET '/api/v1/products/'
  public getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const paginationDto = await CreatePaginationDto.create(req.query)
      const sortingDto = await CreateSortingDto.create(req.query)
      const response = await this.productService.getAllProducts(
        paginationDto,
        sortingDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // GET '/api/v1/products/:term'
  public getProductByTerm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const relationsDto = await RelationsProductDto.create(req.query)
      const term = req.params.term
      const response = await this.productService.getProductByTerm(
        term,
        relationsDto
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
