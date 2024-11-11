import { NextFunction, Request, Response } from 'express'
import { BadRequestException } from '../errors'

/**
 * Middleware que verifica si se han subido archivos en la solicitud.
 * Si no se han subido archivos o si no se encuentran en el formato
 * esperado, lanza una excepción.
 */
export class FileUploadMiddleware {
  /**
   * Verifica si la solicitud contiene archivos y los agrega a `res.locals.files`.
   * Si no se encuentran archivos, lanza una excepción de tipo `BadRequestException`.
   * Si los archivos no son un array, los convierte en un array para su manejo uniforme.
   *
   * @param {Request} req - El objeto de la solicitud HTTP.
   * @param {Response} res - El objeto de la respuesta HTTP.
   * @param {NextFunction} next - Función para pasar al siguiente middleware.
   */
  static containFiles(req: Request, res: Response, next: NextFunction) {
    // Verifica si la solicitud contiene archivos
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new BadRequestException('No files were selected')
    }

    // Si no es un array de archivos, lo convierte en uno para su procesamiento uniforme
    if (!Array.isArray(req.files.file)) {
      res.locals.files = [req.files.file]
    } else {
      res.locals.files = req.files.file
    }

    // Continúa al siguiente middleware
    next()
  }
}
