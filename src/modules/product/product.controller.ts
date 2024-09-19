import { NextFunction, Request, Response } from 'express'

import { ProductService } from '@modules/product'
import {
  CreateProductDto,
  CreateProductPriceDto,
  UpdateProductDto,
  UpdateProductPriceDto,
} from '@modules/product/dtos'
import { PaginationDto } from '@modules/shared/dtos'

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // POST '/api/v1/product/'
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

  // GET '/api/v1/product/'
  public getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await PaginationDto.create(req.query)
      const response = await this.productService.getAllProducts(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // GET '/api/v1/product/:term'
  public getProductByTerm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this.productService.getProductByTerm(
        req.params.term
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // PUT '/api/v1/product/:id'
  public updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const dto = await UpdateProductDto.create(req.body)
      const response = await this.productService.updateProduct(id, dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // DELETE '/api/v1/product/:id'
  public deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = +req.params.id
      const response = await this.productService.deleteProduct(id)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // POST '/api/v1/product/:productId/price'
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

  // GET '/api/v1/product/:productId/price'
  public getProductPricesByProductId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = +req.params.productId
      const dto = await PaginationDto.create(req.query)
      const response = await this.productService.getProductPricesByProductId(
        productId,
        dto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // PUT '/api/v1/product/:productId/price/:priceId'
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

  // DELETE '/api/v1/product/:productId/price/:priceId'
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
