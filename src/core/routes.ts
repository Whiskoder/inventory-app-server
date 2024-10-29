import { Router } from 'express'

import { AuthRoutes } from '@modules/auth'
import { CategoryRoutes } from '@modules/category'
import { BranchRoutes } from '@modules/branch'
import { ProductRoutes } from '@modules/product'
import { ProviderRoutes } from '@modules/provider'
import { OrderRoutes } from '@modules/order'
import { BrandRoutes } from '@modules/brand'
import { InvoiceRoutes } from '@modules/invoice'

export class AppRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    router.use('/v1/auth', AuthRoutes.routes)
    router.use('/v1/categories', CategoryRoutes.routes)
    router.use('/v1/branches', BranchRoutes.routes)
    router.use('/v1/products', ProductRoutes.routes)
    router.use('/v1/providers', ProviderRoutes.routes)
    router.use('/v1/orders', OrderRoutes.routes)
    router.use('/v1/brands', BrandRoutes.routes)
    router.use('/v1/invoices', InvoiceRoutes.routes)

    return router
  }
}
