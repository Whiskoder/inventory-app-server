import { Router } from 'express'
import { AuthController } from '@presentation/auth/controller'
import { AuthService } from '@presentation/services'
import { JWT } from '@config/plugins'
import { AppDataSource } from '@db/datasources'
import { User } from '@db/models'

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()

    const jwtPlugin = JWT.instance()
    const userRepository = AppDataSource.getRepository(User)
    const authService = new AuthService(jwtPlugin, userRepository)
    const controller = new AuthController(authService)

    router.post('/login', controller.loginUser)
    router.post('/register', controller.registerUser)

    return router
  }
}
