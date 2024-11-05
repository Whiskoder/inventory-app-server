import createError from 'http-errors'

import { HTTPStatusCode } from '@/modules/shared/enums/http'
import { HTTPMessages } from '@/modules/shared/constants'

/**
 * Excepción personalizada para el código de estado HTTP 400 - Bad Request.
 * Lanza un error con el mensaje de Bad Request por defecto o uno personalizado.
 */
export class BadRequestException {
  constructor(message = HTTPMessages.BAD_REQUEST) {
    throw createError(HTTPStatusCode.BadRequest, message)
  }
}

/**
 * Excepción personalizada para el código de estado HTTP 401 - Unauthorized.
 * Lanza un error con el mensaje de Unauthorized por defecto o uno personalizado.
 */
export class UnauthorizedException {
  constructor(message = HTTPMessages.UNAUTHORIZED) {
    throw createError(HTTPStatusCode.Unauthorized, message)
  }
}

/**
 * Excepción personalizada para el código de estado HTTP 403 - Forbidden.
 * Lanza un error con el mensaje de Forbidden por defecto o uno personalizado.
 */
export class ForbiddenException {
  constructor(message = HTTPMessages.FORBIDDEN) {
    throw createError(HTTPStatusCode.Forbidden, message)
  }
}

/**
 * Excepción personalizada para el código de estado HTTP 404 - Not Found.
 * Lanza un error con el mensaje de Not Found por defecto o uno personalizado.
 */
export class NotFoundException {
  constructor(message = HTTPMessages.NOT_FOUND) {
    throw createError(HTTPStatusCode.NotFound, message)
  }
}

/**
 * Excepción personalizada para el código de estado HTTP 409 - Conflict.
 * Lanza un error con el mensaje de Conflict por defecto o uno personalizado.
 */
export class ConflictException {
  constructor(message = HTTPMessages.CONFLICT) {
    throw createError(HTTPStatusCode.Conflict, message)
  }
}

/**
 * Excepción personalizada para el código de estado HTTP 422 - Unprocessable Entity.
 * Lanza un error con el mensaje de Unprocessable Entity por defecto o uno personalizado.
 */
export class UnprocessableEntityException {
  constructor(message = HTTPMessages.UNPROCESSABLE_ENTITY) {
    throw createError(HTTPStatusCode.UnprocessableEntity, message)
  }
}

/**
 * Excepción personalizada para el código de estado HTTP 429 - Too Many Requests.
 * Lanza un error con el mensaje de Too Many Requests por defecto o uno personalizado.
 */
export class TooManyRequestsException {
  constructor(message = HTTPMessages.TOO_MANY_REQUESTS) {
    throw createError(HTTPStatusCode.TooManyRequests, message)
  }
}

/**
 * Excepción personalizada para el código de estado HTTP 500 - Internal Server Error.
 * Lanza un error con el mensaje de Internal Server Error por defecto o uno personalizado.
 */
export class InternalServerErrorException {
  constructor(message = HTTPMessages.INTERNAL_SERVER_ERROR) {
    throw createError(HTTPStatusCode.InternalServerError, message)
  }
}

/**
 * Excepción personalizada para el código de estado HTTP 502 - Bad Gateway.
 * Lanza un error con el mensaje de Bad Gateway por defecto o uno personalizado.
 */
export class BadGatewayException {
  constructor(message = HTTPMessages.BAD_GATEWAY) {
    throw createError(HTTPStatusCode.BadGateway, message)
  }
}
