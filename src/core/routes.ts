import { Router } from 'express'

import { AuthRoutes } from '@modules/auth'
import { CategoryRoutes } from '@modules/category'
import { RestaurantRoutes } from '@modules/restaurant'
import { ProductRoutes } from '@modules/product'
import { ProviderRoutes } from '@modules/provider'
import { OrderRoutes } from '@modules/order'

export class AppRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    router.use('/api/v1/auth', AuthRoutes.routes)
    router.use('/api/v1/category', CategoryRoutes.routes)
    router.use('/api/v1/restaurant', RestaurantRoutes.routes)
    router.use('/api/v1/product', ProductRoutes.routes)
    router.use('/api/v1/provider', ProviderRoutes.routes)
    router.use('/api/v1/order', OrderRoutes.routes)

    return router
  }
}
