import { Router } from 'express'

import { AuthRoutes } from '@modules/auth'
import { CategoryRoutes } from '@modules/category'

export class AppRoutes {
  static get routes(): Router {
    const router = Router()

    router.use('/api/v1/auth', AuthRoutes.routes)
    router.use('/api/v1/category', CategoryRoutes.routes)

    return router
  }
}
