import { NextFunction, Request, Response } from "express";

import { AuthService } from "@modules/auth";
import { RegisterUserDto, LoginUserDto } from "@modules/auth/dtos";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST '/v1/auth/login'
  public loginUser = async (
    req: Request, // <- La información de la petición
    res: Response, // <- La información de la respuesta
    next: NextFunction,
  ) => {
    try {
      const dto = await LoginUserDto.create(req.body);
      const response = await this.authService.loginUser(dto);
      res.status(response.statusCode).json(response)
    } catch (e) {
      // Continua el codigo aqui
      next(e);
    }
  };

  // POST '/v1/auth/register'
  public registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dto = await RegisterUserDto.create(req.body);
      const response = await this.authService.registerUser(dto);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  //GET '/v1/auth/permissions'
  public getUserPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userEntity = res.locals.user;
      const response = await this.authService.getUserPermissions(userEntity);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  // GET '/v1/auth/check'
  public checkAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = res.locals.user;
      const response = await this.authService.checkAuth(user);
      res.status(response.statusCode).json(response);
    } catch (e) {
      next(e);
    }
  };
}
