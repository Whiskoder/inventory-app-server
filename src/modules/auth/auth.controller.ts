import { NextFunction, Request, Response } from 'express'

import { AuthService } from '@modules/auth'
import { RegisterUserDto, LoginUserDto } from '@modules/auth/dtos'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST '/api/v1/auth/login'
  public loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await LoginUserDto.create(req.body)
      const response = await this.authService.loginUser(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // POST '/api/v1/auth/register'
  public registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = await RegisterUserDto.create(req.body)
      const response = await this.authService.registerUser(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  // GET '/api/v1/auth/check'
  public checkAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = res.locals.user
      const response = await this.authService.checkAuth(user)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
