import { Request, Response, NextFunction } from 'express'
import { isArray, ValidationError } from 'class-validator'

import { HTTPStatusCode } from '@core/enums/http'
import { IHTTPError } from '@core/extensions'

export class ExceptionHandlerMiddleware {
  // This method get class-validator validation errors and send them to the client in a structured format.
  private static isValidationError(error: IHTTPError, res: Response): boolean {
    if (!isArray(error)) return false

    const constraints = error.reduce((message: string[], err) => {
      if (err instanceof ValidationError) {
        const value = Object.values(err.constraints || {})
        message.push(...value)
        return message
      }
      return message
    }, [])

    if (constraints.length < 0) return false

    const statusCode = HTTPStatusCode.BadRequest

    res.status(statusCode).send({
      statusCode,
      error: ExceptionHandlerMiddleware.getHTTPMessage(statusCode),
      message: constraints,
    })

    return true
  }

  private static getHTTPMessage(statusCode: number): string {
    // This regex will add a space between lowercase and uppercase letters
    return HTTPStatusCode[statusCode].replace(/([a-z])([A-Z])/g, '$1 $2')
  }

  public static handle = (
    error: IHTTPError,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    // Check if error origin is from class-validator
    if (ExceptionHandlerMiddleware.isValidationError(error, res)) return

    // 23505 code is throw when a duplicate key is found in the database
    if (error?.code === '23505') {
      const statusCode = HTTPStatusCode.BadRequest
      res.status(statusCode).send({
        statusCode,
        error: ExceptionHandlerMiddleware.getHTTPMessage(statusCode),
        message: error?.detail || 'Duplicate entry',
      })
      return
    }

    const statusCode = error.statusCode || 500

    // Avoid sending stack trace to client in production
    const message =
      statusCode === 500
        ? 'Internal Server Error'
        : error.message || 'Something went wrong'

    // TODO: Implement winston logger
    console.log({
      req: {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        query: req.query,
        params: req.params,
      },
      res: {
        statusCode: res.statusCode,
        message,
      },
      error,
    })

    return res.status(statusCode).send({
      statusCode,
      error: ExceptionHandlerMiddleware.getHTTPMessage(statusCode),
      message,
    })
  }
}
