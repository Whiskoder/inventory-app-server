import { NextFunction, Request, Response } from 'express'

import { ProductService } from '@modules/product'

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //POST '/api/v1/auth/register'
  public registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // const dto = await RegisterUserDto.create(req.body)
      // const user = await this.authService.registerUser(dto)
      // res.json(user)
    } catch (e) {
      next(e)
    }
  }
}
