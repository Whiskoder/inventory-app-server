import { Router } from 'express'
import { AuthRoutes } from '@presentation/auth/routes'
import { CategoryRoutes } from '@presentation/category/routes'

export class AppRoutes {
  static get routes(): Router {
    const router = Router()

    router.use('/api/v1/auth', AuthRoutes.routes)
    router.use('/api/v1/category', CategoryRoutes.routes)

    return router
  }
}
