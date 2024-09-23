import { Router } from 'express'

import { FilterMiddleware } from '@/core/middlewares'
import { AppDataSource } from '@core/datasources'
import { AuthController, AuthService } from '@modules/auth'
import { JWT } from '@config/plugins'
import { User } from '@modules/user/models'
import { LoginUserDto, RegisterUserDto } from '@modules/auth/dtos'

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()

    const jwtPlugin = JWT.instance()
    const userRepository = AppDataSource.getRepository(User)
    const authService = new AuthService(jwtPlugin, userRepository)
    const controller = new AuthController(authService)

    router.use(FilterMiddleware.validateQuery())
    router.post(
      '/login',
      [FilterMiddleware.validateBody([LoginUserDto])],
      controller.loginUser
    )
    router.post(
      '/register',
      [FilterMiddleware.validateBody([RegisterUserDto])],
      controller.registerUser
    )

    return router
  }
}
