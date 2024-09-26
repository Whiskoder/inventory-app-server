import { Response, Request } from 'express'
import httpMocks from 'node-mocks-http'
import createError from 'http-errors'

import { ExceptionHandlerMiddleware } from '@core/middlewares'
import { HTTPStatusCode } from '@/modules/shared/enums/http'
import { LoginUserDto } from '@/modules/auth/dtos'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import exp from 'constants'

describe('exception-handler.middleware.test.ts', () => {
  const mockReq = httpMocks.createRequest<Request>()
  const mockRes = httpMocks.createResponse<Response>()
  const mockNext = jest.fn()

  it('should format error message response', async () => {
    const getHTTPMessageSpy = jest.spyOn(
      ExceptionHandlerMiddleware as any,
      'getHTTPMessage'
    )

    const mockErr = createError(HTTPStatusCode.InternalServerError)
    ExceptionHandlerMiddleware.handle(mockErr, mockReq, mockRes, mockNext)

    expect(getHTTPMessageSpy).toHaveBeenCalledTimes(1)
    expect(getHTTPMessageSpy).toHaveBeenCalledWith(
      HTTPStatusCode.InternalServerError
    )
    expect(getHTTPMessageSpy).toHaveReturnedWith('Internal Server Error')
  })

  it('should check if the error is validation error and return false', async () => {
    const isValidationErrorSpy = jest.spyOn(
      ExceptionHandlerMiddleware as any,
      'isValidationError'
    )

    const mockErr = createError(HTTPStatusCode.BadRequest)
    ExceptionHandlerMiddleware.handle(mockErr, mockReq, mockRes, mockNext)

    expect(isValidationErrorSpy).toHaveBeenCalledTimes(1)
    expect(isValidationErrorSpy).toHaveReturnedWith(false)
    expect(isValidationErrorSpy).toHaveBeenCalledWith(mockErr, mockReq, mockRes)
  })

  it('should check if the error is validation error and return false if array is empty', async () => {
    const isValidationErrorSpy = jest.spyOn(
      ExceptionHandlerMiddleware as any,
      'isValidationError'
    )
    const mockErr = [] as any

    ExceptionHandlerMiddleware.handle(mockErr, mockReq, mockRes, mockNext)

    expect(isValidationErrorSpy).toHaveBeenCalledTimes(1)
    expect(isValidationErrorSpy).toHaveReturnedWith(false)
    expect(isValidationErrorSpy).toHaveBeenCalledWith(mockErr, mockReq, mockRes)
  })

  it('should check if the error is validation error and return true', async () => {
    const isValidationErrorSpy = jest.spyOn(
      ExceptionHandlerMiddleware as any,
      'isValidationError'
    )

    const dto = plainToInstance(LoginUserDto, {})
    const mockErr = (await validate(dto)) as any

    ExceptionHandlerMiddleware.handle(mockErr, mockReq, mockRes, mockNext)

    expect(isValidationErrorSpy).toHaveBeenCalledTimes(1)
    expect(isValidationErrorSpy).toHaveReturnedWith(true)
    expect(isValidationErrorSpy).toHaveBeenCalledWith(mockErr, mockReq, mockRes)

    const { error, message, statusCode } = mockRes._getData()
    expect(error).toEqual('Bad Request')
    expect(statusCode).toEqual(400)
    expect(message).toEqual(expect.any(Array))
    expect(message).toEqual([
      'email must be an email',
      'password must be longer than or equal to 8 characters',
      'password must be a string',
    ])
  })

  it('should handle duplicated key error', async () => {
    const detail = 'Duplicated key error'
    const mockErr = {
      code: '23505', // duplicated key error
      detail,
    } as any

    ExceptionHandlerMiddleware.handle(mockErr, mockReq, mockRes, mockNext)

    const { error, message, statusCode } = mockRes._getData()
    expect(error).toEqual('Bad Request')
    expect(statusCode).toEqual(400)
    expect(message).toEqual(detail)
  })

  it('should handle not allowed null values at column error', async () => {
    const mockErr = {
      code: '23502', // not allowed null values at column error
    } as any

    ExceptionHandlerMiddleware.handle(mockErr, mockReq, mockRes, mockNext)

    const { error, message, statusCode } = mockRes._getData()
    expect(error).toEqual('Bad Request')
    expect(statusCode).toEqual(400)
    expect(message).toEqual('Null value found')
  })

  it('should handle application error and dont send info to client', async () => {
    const errorMessage = 'Application error'
    const mockErr = new Error(errorMessage) as any
    mockErr.statusCode = 500

    ExceptionHandlerMiddleware.handle(mockErr, mockReq, mockRes, mockNext)

    const { message, error, statusCode } = mockRes._getData()
    expect(error).toEqual('Internal Server Error')
    expect(statusCode).toEqual(500)
    expect(message).not.toEqual(errorMessage)
  })

  it('should handle bad request error', async () => {
    const errorMessage = 'Fake bad request error'
    const mockErr = new Error(errorMessage) as any
    mockErr.statusCode = 400

    ExceptionHandlerMiddleware.handle(mockErr, mockReq, mockRes, mockNext)

    const { message, error, statusCode } = mockRes._getData()
    expect(error).toEqual('Bad Request')
    expect(statusCode).toEqual(400)
    expect(message).toEqual(errorMessage)
  })
})
