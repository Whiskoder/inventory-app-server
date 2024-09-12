import { BadRequestException } from '@/domain/errors'
import { HTTPStatusCode } from '@domain/enums/http'
import { IHTTPError } from '@domain/extensions'
import { isArray, ValidationError } from 'class-validator'
import { Request, Response, NextFunction } from 'express'

export class ExceptionHandlerMiddleware {
  public static isValidationError(error: IHTTPError, res: Response): boolean {
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
    const statusCodeName = HTTPStatusCode[statusCode]

    res.status(statusCode).send({
      statusCode,
      error: statusCodeName,
      message: constraints,
    })

    return true
  }

  public static handle = (
    error: IHTTPError,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (ExceptionHandlerMiddleware.isValidationError(error, res)) return
    if (error?.code === '23505') {
      const statusCode = HTTPStatusCode.BadRequest
      const statusCodeName = HTTPStatusCode[statusCode]
      res.status(statusCode).send({
        statusCode,
        error: statusCodeName,
        message: error?.detail || 'Duplicate entry',
      })
      return
    }

    const statusCode = error.statusCode || 500
    const statusCodeName = HTTPStatusCode[statusCode]

    const message =
      statusCode === 500
        ? 'Internal Server Error'
        : error.message || 'Something went wrong'

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

    return res
      .status(statusCode)
      .send({ statusCode, error: statusCodeName, message })
  }
}
