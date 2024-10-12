import * as Exceptions from '@core/errors'
import HTTPErrors from 'http-errors'

describe('exceptions.test.ts', () => {
  it('should throw a Bad Request Exception', () => {
    try {
      new Exceptions.BadRequestException()
    } catch (e: any) {
      expect(e).toBeInstanceOf(HTTPErrors.BadRequest)
      expect(e.statusCode).toBe(400)
    }
  })

  it('should throw a Unauthorized Exception', () => {
    try {
      new Exceptions.UnauthorizedException()
    } catch (e: any) {
      expect(e).toBeInstanceOf(HTTPErrors.Unauthorized)

      expect(e.statusCode).toBe(401)
    }
  })

  it('should throw a Forbidden Exception', () => {
    try {
      new Exceptions.ForbiddenException()
    } catch (e: any) {
      expect(e).toBeInstanceOf(HTTPErrors.Forbidden)
      expect(e.statusCode).toBe(403)
    }
  })

  it('should throw a Not Found Exception', () => {
    try {
      new Exceptions.NotFoundException()
    } catch (e: any) {
      expect(e).toBeInstanceOf(HTTPErrors.NotFound)
      expect(e.statusCode).toBe(404)
    }
  })

  it('should throw a Conflict Exception', () => {
    try {
      new Exceptions.ConflictException()
    } catch (e: any) {
      expect(e).toBeInstanceOf(HTTPErrors.Conflict)
      expect(e.statusCode).toBe(409)
    }
  })

  it('should throw a Unprocessable Entity Exception', () => {
    try {
      new Exceptions.UnprocessableEntityException()
    } catch (e: any) {
      expect(e).toBeInstanceOf(HTTPErrors.UnprocessableEntity)
      expect(e.statusCode).toBe(422)
    }
  })

  it('should throw a Too Many Requests Exception', () => {
    try {
      new Exceptions.TooManyRequestsException()
    } catch (e: any) {
      expect(e).toBeInstanceOf(HTTPErrors.TooManyRequests)
      expect(e.statusCode).toBe(429)
    }
  })

  it('should throw a Internal Server Exception Exception', () => {
    try {
      new Exceptions.InternalServerErrorException()
    } catch (e: any) {
      expect(e).toBeInstanceOf(HTTPErrors.InternalServerError)
      expect(e.statusCode).toBe(500)
    }
  })

  it('should throw a Bad Gateway Exception', () => {
    try {
      new Exceptions.BadGatewayException()
    } catch (e: any) {
      expect(e).toBeInstanceOf(HTTPErrors.BadGateway)
      expect(e.statusCode).toBe(502)
    }
  })
})
