import { Router } from 'express'

import { AppDataSource } from '@core/datasources'
import { AuthMiddleware } from '@core/middlewares'
import { User } from '@modules/user/models'
import { UserController, UserService } from '@modules/user'

export class UserRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const userRepository = AppDataSource.getRepository(User)
    const userService = new UserService(userRepository)
    const controller = new UserController(userService)

    router.use(AuthMiddleware.validateToken)

    return router
  }
}
