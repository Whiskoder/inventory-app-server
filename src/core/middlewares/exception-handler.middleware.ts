import { Request, Response, NextFunction } from 'express'
import { isArray, ValidationError } from 'class-validator'

import { HTTPStatusCode } from '@/modules/shared/enums/http'
import { IHTTPError } from '@/modules/shared/extensions'
import { AppLogger } from '../logger/app-logger'

const logger = AppLogger.create('ExceptionHandler')

/**
 * Middleware para manejar excepciones en la aplicación.
 * Se encarga de capturar errores de validación, errores de base de datos,
 * y errores generales, y enviar una respuesta estructurada al cliente.
 */
export class ExceptionHandlerMiddleware {
  /**
   * Maneja los errores capturados en la aplicación.
   * Dependiendo del tipo de error, se genera una respuesta adecuada.
   * @param {IHTTPError} error - El error que ocurrió.
   * @param {Request} req - El objeto de la solicitud HTTP.
   * @param {Response} res - El objeto de la respuesta HTTP.
   * @param {NextFunction} _next - Función para pasar al siguiente middleware.
   */
  public static handle = (
    error: IHTTPError,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    // Verifica si el error proviene de la validación de class-validator
    if (ExceptionHandlerMiddleware.isValidationError(error, req, res)) return

    // Maneja errores específicos de base de datos por claves duplicadas
    if (error?.code === '23505') {
      const statusCode = HTTPStatusCode.BadRequest
      res.status(statusCode).send({
        statusCode,
        error: ExceptionHandlerMiddleware.getHTTPMessage(statusCode),
        message: error?.detail || 'Duplicate entry',
      })
      return
    }
    // Maneja errores de base de datos por valores nulos en columnas no nulas
    if (error?.code === '23502') {
      const statusCode = HTTPStatusCode.BadRequest
      res.status(statusCode).send({
        statusCode,
        error: ExceptionHandlerMiddleware.getHTTPMessage(statusCode),
        message: 'Null value found',
      })
      logger.httpError(req, res, error)
      return
    }

    if (error instanceof TypeError) {
      // Maneja errores de tipo `TypeError` (ej. cuando el cuerpo de la solicitud está vacío)
      if (
        error.message.includes(
          "Cannot read properties of undefined (reading 'constructor')"
        )
      ) {
        const statusCode = HTTPStatusCode.BadRequest
        res.status(statusCode).send({
          statusCode,
          error: ExceptionHandlerMiddleware.getHTTPMessage(statusCode),
          message: 'Body is empty',
        })
        logger.httpError(req, res, error)
        return
      }
    }

    // Maneja errores generales y envía una respuesta con el código de estado adecuado
    const statusCode = error.statusCode || 500

    // Evita enviar el stack trace al cliente en producción
    const message =
      statusCode === 500
        ? 'Internal Server Error'
        : error.message || 'Something went wrong'
    if (statusCode >= 500) {
      logger.error(error.stack)
    } else {
      logger.httpError(req, res, error)
    }

    // Envío de respuesta al cliente con el error procesado
    return res.status(statusCode).send({
      statusCode,
      error: ExceptionHandlerMiddleware.getHTTPMessage(statusCode),
      message,
    })
  }

  /**
   * Verifica si el error es de validación (usando `class-validator`).
   * Si lo es, se envía una respuesta con los mensajes de validación.
   * @param {IHTTPError} error - El error a verificar.
   * @param {Request} req - El objeto de la solicitud HTTP.
   * @param {Response} res - El objeto de la respuesta HTTP.
   * @returns {boolean} - Devuelve `true` si el error es de validación, de lo contrario `false`.
   */
  private static isValidationError(
    error: IHTTPError,
    req: Request,
    res: Response
  ): boolean {
    if (!isArray(error)) return false

    const constraints = error.reduce((message: string[], err) => {
      if (err instanceof ValidationError) {
        const value = Object.values(err.constraints || {})
        message.push(...value)
        return message
      }
      return message
    }, [])

    if (constraints.length <= 0) return false

    const statusCode = HTTPStatusCode.BadRequest

    res.status(statusCode).send({
      statusCode,
      error: ExceptionHandlerMiddleware.getHTTPMessage(statusCode),
      message: constraints,
    })

    return true
  }

  /**
   * Obtiene el mensaje correspondiente al código de estado HTTP.
   * @param {number} statusCode - El código de estado HTTP.
   * @returns {string} - El mensaje asociado al código de estado.
   */
  private static getHTTPMessage(statusCode: number): string {
    // Esta expresión regular agrega un espacio entre letras minúsculas y mayúsculas
    return HTTPStatusCode[statusCode].replace(/([a-z])([A-Z])/g, '$1 $2')
  }
}
