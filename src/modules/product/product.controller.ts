import { NextFunction, Request, Response } from 'express'

import { ProductService } from '@modules/product'
import {
  CreateProductDto,
  CreateProductPriceDto,
  UpdateProductDto,
  UpdateProductPriceDto,
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
      const term = req.params.term
      const response = await this.productService.getProductByTerm(term)
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

  // POST '/api/v1/products/:productId/prices'
  public createProductPrice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = +req.params.productId
      const dto = await CreateProductPriceDto.create(req.body)
      const response = await this.productService.createProductPrice(
        productId,
        dto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // GET '/api/v1/products/:productId/prices'
  public getProductPricesByProductId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = +req.params.productId
      const paginationDto = await CreatePaginationDto.create(req.query)
      const sortingDto = await CreateSortingDto.create(req.query)
      const response = await this.productService.getProductPricesByProductId(
        productId,
        paginationDto,
        sortingDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // PUT '/api/v1/products/:productId/prices/:priceId'
  public updateProductPrice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = +req.params.productId
      const priceId = +req.params.priceId
      const dto = await UpdateProductPriceDto.create(req.body)
      const response = await this.productService.updateProductPrice(
        productId,
        priceId,
        dto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // DELETE '/api/v1/products/:productId/prices/:priceId'
  public deleteProductPrice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = +req.params.productId
      const priceId = +req.params.priceId
      const response = await this.productService.deleteProductPrice(
        productId,
        priceId
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
