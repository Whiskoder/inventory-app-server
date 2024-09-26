import { Request, Response } from 'express'
import httpMocks from 'node-mocks-http'
import { Repository } from 'typeorm'

import { AuthMiddleware } from '@core/middlewares'
import { JWT } from '@config/plugins'
import { AppDataSource } from '@core/datasources'
import { User } from '@modules/user/models'
import { Action, Resource, Role } from '@config/roles'

describe('auth.middleware.test.ts', () => {
  const jwtPlugin = JWT.instance()
  const mockResponse = httpMocks.createResponse<Response>()
  const mockNextFunction = jest.fn()
  let userRepository: Repository<User>

  beforeAll(async () => {
    await AppDataSource.initialize()
    userRepository = AppDataSource.getRepository(User)
  })

  beforeEach(async () => {
    await userRepository.delete({})
  })

  afterAll(async () => {
    await userRepository.delete({})
    await AppDataSource.destroy()
  })

  it('should validate token', async () => {
    const userEntity = userRepository.create({
      firstName: 'John',
      email: 'john@example.com',
      password: '123456Ab@',
    })
    await userRepository.save(userEntity)
    const token = await jwtPlugin.generateToken({
      payload: { id: userEntity.id },
    })

    const mockRequest = httpMocks.createRequest<Request>({
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    await AuthMiddleware.validateToken(
      mockRequest,
      mockResponse,
      mockNextFunction
    )

    expect(mockNextFunction).toHaveBeenCalledTimes(1)
    expect(mockNextFunction).not.toHaveBeenCalledWith(expect.any(Error))

    const { password, ...user } = userEntity
    expect(mockResponse.locals.user).toEqual(
      expect.objectContaining({
        ...user,
        role: Role.EMPLOYEE,
        isActive: undefined,
      })
    )
  })

  it('should throw error if no token provided', async () => {
    const mockRequest = httpMocks.createRequest<Request>({
      headers: {},
    })

    try {
      await AuthMiddleware.validateToken(
        mockRequest,
        mockResponse,
        mockNextFunction
      )
    } catch (e) {
      expect(e).toBeDefined()
      expect(e).toHaveProperty('statusCode', 401)
    }
  })

  it('should throw error if bearer token is invalid', async () => {
    const mockRequest = httpMocks.createRequest<Request>({
      headers: {
        authorization: 'API <token>',
      },
    })

    try {
      await AuthMiddleware.validateToken(
        mockRequest,
        mockResponse,
        mockNextFunction
      )
    } catch (e) {
      expect(e).toBeDefined()
      expect(e).toHaveProperty('statusCode', 401)
      return
    }
    expect(true).toBe(false)
  })

  it('should throw an error if token is expired', async () => {
    const token = await jwtPlugin.generateToken({
      payload: { id: 1 },
      duration: '-1h',
    })
    const mockRequest = httpMocks.createRequest<Request>({
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    await AuthMiddleware.validateToken(
      mockRequest,
      mockResponse,
      mockNextFunction
    )
    expect(mockNextFunction).toHaveBeenCalledTimes(1)
    expect(mockNextFunction).toHaveBeenCalledWith(expect.any(Error))
  })

  it('should throw an error if token is invalid', async () => {
    const token = await jwtPlugin.generateToken({
      payload: { id: 'one' },
      duration: '2h',
    })
    const mockRequest = httpMocks.createRequest<Request>({
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    await AuthMiddleware.validateToken(
      mockRequest,
      mockResponse,
      mockNextFunction
    )
    expect(mockNextFunction).toHaveBeenCalledTimes(1)
    expect(mockNextFunction).toHaveBeenCalledWith(expect.any(Error))
  })

  it('should throw an error if user doesnt exist', async () => {
    const token = await jwtPlugin.generateToken({
      payload: { id: '1' },
      duration: '2h',
    })
    const mockRequest = httpMocks.createRequest<Request>({
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    await AuthMiddleware.validateToken(
      mockRequest,
      mockResponse,
      mockNextFunction
    )
    expect(mockNextFunction).toHaveBeenCalledTimes(1)
    expect(mockNextFunction).toHaveBeenCalledWith(expect.any(Error))
  })

  it('should call next if user has permission', async () => {
    const mockReq = httpMocks.createRequest<Request>()
    const mockRes = httpMocks.createResponse<Response>({
      locals: { user: { role: Role.ADMIN } },
    })

    AuthMiddleware.checkPermission(Resource.BRANCH, Action.CREATE)(
      mockReq,
      mockRes,
      mockNextFunction
    )

    expect(mockNextFunction).toHaveBeenCalledTimes(1)
    expect(mockNextFunction).not.toHaveBeenCalledWith(expect.any(Error))
  })

  it('should return forbidden exception', async () => {
    const mockReq = httpMocks.createRequest<Request>()
    const mockRes = httpMocks.createResponse<Response>({
      locals: { user: { role: Role.EMPLOYEE } },
    })
    try {
      AuthMiddleware.checkPermission(Resource.BRANCH, Action.CREATE)(
        mockReq,
        mockRes,
        mockNextFunction
      )
    } catch (e) {
      expect(e).toBeDefined()
      expect(e).toHaveProperty('statusCode', 403)
      return
    }
    expect(true).toBe(false)
  })
})
