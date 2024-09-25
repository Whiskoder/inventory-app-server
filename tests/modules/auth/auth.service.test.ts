import { Repository } from 'typeorm'
import { JWT } from '@config/plugins'
import { Role } from '@config/roles'
import { AppDataSource } from '@core/datasources'
import { AuthService } from '@modules/auth'
import { RegisterUserDto } from '@modules/auth/dtos'
import { User } from '@modules/user/models'

describe('auth.service.test.ts', () => {
  const jwt = JWT.instance()
  let userRepository: Repository<User>
  let authService: AuthService
  beforeAll(async () => {
    await AppDataSource.initialize()
    userRepository = AppDataSource.getRepository(User)
    authService = new AuthService(jwt, userRepository)
  })

  beforeEach((done) => {
    userRepository
      .delete({})
      .then(() => done())
      .catch(done) // Pass error to done if it fails
  })

  afterAll((done) => {
    userRepository
      .delete({})
      .then(() => AppDataSource.destroy())
      .then(() => done())
      .catch(done) // Pass error to done if it fails
  })

  // beforeEach(async () => {
  //   await userRepository.delete({})
  // })

  // afterAll(async () => {
  //   await userRepository.delete({})
  //   await AppDataSource.destroy()
  // })

  const testUser: RegisterUserDto = {
    contactPhone: '+522742458721',
    email: 'juan_gonzo@gmail.com',
    firstName: 'Juan',
    lastName: 'Gonzales Hernandez',
    password: '123456Ab@',
  }

  it('should return user and valid token', async () => {
    const response = await authService.registerUser(testUser)

    expect(response).toEqual({
      statusCode: 201,
      status: 'Created',
      message: undefined,
      data: {
        user: {
          contactPhone: testUser.contactPhone,
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          id: expect.any(Number),
          createdAt: expect.any(Date),
          role: Role.EMPLOYEE,
          orders: undefined,
          isActive: true,
        },
        token: expect.any(String),
      },
    })

    expect(jwt.verifyToken(response.data!.token)).toBeTruthy()
  })

  it('should return bad request error if email is in use', async () => {
    await authService.registerUser(testUser)
    await expect(authService.registerUser(testUser)).rejects.toHaveProperty(
      'statusCode',
      400
    )
  })

  it('should login user and return valid token', async () => {
    await authService.registerUser(testUser)
    const { email, password } = testUser
    const response = await authService.loginUser({ email, password })

    expect(response).toEqual({
      statusCode: 200,
      status: 'Success',
      message: undefined,
      data: {
        user: {
          id: expect.any(Number),
          contactPhone: testUser.contactPhone,
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          role: Role.EMPLOYEE,
          orders: undefined,
          isActive: undefined,
        },
        token: expect.any(String),
      },
    })
    expect(jwt.verifyToken(response.data!.token)).toBeTruthy()
  })

  it('should return error bad request error if credentials are wrong', async () => {
    await authService.registerUser(testUser)
    const loginUserDto = {
      email: testUser.email,
      password: 'incorrectPassword',
    }
    await expect(authService.loginUser(loginUserDto)).rejects.toHaveProperty(
      'statusCode',
      400
    )
  })
})
