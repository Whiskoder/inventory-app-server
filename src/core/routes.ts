import { Router } from 'express'

import { AuthRoutes } from '@modules/auth'
import { CategoryRoutes } from '@modules/category'
import { BranchRoutes } from '@modules/branch'
import { ProductRoutes } from '@modules/product'
import { ProviderRoutes } from '@modules/provider'
import { OrderRoutes } from '@modules/order'

export class AppRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    router.use('/api/v1/auth', AuthRoutes.routes)
    router.use('/api/v1/categories', CategoryRoutes.routes)
    router.use('/api/v1/branches', BranchRoutes.routes)
    router.use('/api/v1/products', ProductRoutes.routes)
    router.use('/api/v1/providers', ProviderRoutes.routes)
    router.use('/api/v1/orders', OrderRoutes.routes)

    return router
  }
}
