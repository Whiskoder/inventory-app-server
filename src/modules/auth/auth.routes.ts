import { Router } from 'express'

import { AppDataSource } from '@core/datasources'
import { AuthController, AuthService } from '@modules/auth'
import { JWT } from '@config/plugins'
import { User } from '@modules/user/models'
import { AuthMiddleware } from '@core/middlewares'

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()

    const jwtPlugin = JWT.instance()
    const userRepository = AppDataSource.getRepository(User)
    const authService = new AuthService(jwtPlugin, userRepository)
    const controller = new AuthController(authService)

    router.post('/login', controller.loginUser)
    router.post('/register', controller.registerUser)
    router.get('/check', [AuthMiddleware.validateToken], controller.checkAuth)
    router.get(
      '/permissions',
      [AuthMiddleware.validateToken],
      controller.getUserPermissions
    )

    return router
  }
}
