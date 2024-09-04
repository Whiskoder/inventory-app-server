import { Router } from 'express'
import { TestRoutes } from '@presentation/test/routes'

export class AppRoutes {
  static get routes(): Router {
    const router = Router()

    router.use('/api/test', TestRoutes.routes)

    return router
  }
}
