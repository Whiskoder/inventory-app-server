import { Router } from 'express'

import { AuthRoutes } from '@modules/auth'
import { CategoryRoutes } from '@modules/category'
import { BranchRoutes } from '@modules/branch'
import { ProductRoutes } from '@modules/product'
import { ProviderRoutes } from '@modules/provider'
import { OrderRoutes } from '@modules/order'
import { BrandRoutes } from '@modules/brand'
import { InvoiceRoutes } from '@modules/invoice'
import { UserRoutes } from '@modules/user'

/**
 * Clase que define las rutas principales de la aplicación.
 * Cada módulo de la aplicación tiene su propio conjunto de rutas,
 * que son agrupadas y prefijadas bajo un path común.
 */
export class AppRoutes {
  /**
   * Método estático que devuelve un objeto Router con todas las rutas configuradas para la API.
   *
   * Este método agrupa las rutas de diferentes módulos bajo el prefijo `/v1/` para su versionado.
   * Cada grupo de rutas es asociado con su módulo correspondiente (por ejemplo, `/v1/auth` para las rutas de autenticación).
   *
   * @returns {Router} El objeto Router configurado con las rutas de la API.
   */
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    // Rutas relacionadas con la autenticación
    router.use('/v1/auth', AuthRoutes.routes)
    // Rutas relacionadas con categorías
    router.use('/v1/categories', CategoryRoutes.routes)
    // Rutas relacionadas con sucursales
    router.use('/v1/branches', BranchRoutes.routes)
    // Rutas relacionadas con productos
    router.use('/v1/products', ProductRoutes.routes)
    // Rutas relacionadas con proveedores
    router.use('/v1/providers', ProviderRoutes.routes)
    // Rutas relacionadas con órdenes
    router.use('/v1/orders', OrderRoutes.routes)
    // Rutas relacionadas con marcas
    router.use('/v1/brands', BrandRoutes.routes)
    // Rutas relacionadas con facturas
    router.use('/v1/invoices', InvoiceRoutes.routes)
    // Rutas relacionadas con usuarios
    router.use('/v1/users', UserRoutes.routes)

    return router
  }
}
