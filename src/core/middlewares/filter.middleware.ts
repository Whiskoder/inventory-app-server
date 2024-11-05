import { Request, Response } from 'express'

import { NotFoundException } from '@core/errors'

/**
 * Middleware para manejar rutas no válidas o no encontradas.
 * Si una ruta no está definida o no corresponde a los métodos disponibles,
 * lanza una excepción de tipo `NotFoundException`.
 */
export class FilterMiddleware {
  /**
   * Maneja las rutas no válidas (404) y lanza una excepción `NotFoundException`.
   * Utiliza el método y la ruta de la solicitud para generar un mensaje descriptivo.
   *
   * @param {Request} req - El objeto de la solicitud HTTP.
   * @param {Response} res - El objeto de la respuesta HTTP.
   * @throws {NotFoundException} - Lanza una excepción si la ruta no es válida.
   */
  public static invalidRoute = (req: Request, res: Response) => {
    const path = req.originalUrl
    const method = req.method
    // Lanza una excepción indicando que no se puede acceder a la ruta solicitada.
    throw new NotFoundException(`Cannot ${method.toUpperCase()} ${path}`)
  }
}
