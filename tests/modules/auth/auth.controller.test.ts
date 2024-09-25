import request from 'supertest'
import { Repository } from 'typeorm'

import { testServer } from '../../../tests/build-server'
import { LoginUserDto, RegisterUserDto } from '@modules/auth/dtos'
import { AppDataSource } from '@core/datasources'
import { User } from '@modules/user/models'
import { bcryptAdapter } from '@/config/plugins'

describe('auth.controller.test.ts', () => {
  let userRepository: Repository<User>

  beforeAll(async () => {
    await testServer.start()
    await AppDataSource.initialize()
    userRepository = AppDataSource.getRepository(User)
  })

  beforeEach(async () => {
    await userRepository.delete({})
  })

  afterAll(async () => {
    await userRepository.delete({})
    await testServer.close()
    await AppDataSource.destroy()
  })

  const registerUserDto: RegisterUserDto = {
    contactPhone: '+522742458721',
    email: 'juan_gonzo@gmail.com',
    firstName: 'Juan',
    lastName: 'Gonzales Hernandez',
    password: '123456Ab@',
  }

  const loginUserDto: LoginUserDto = {
    email: 'juan_gonzo@gmail.com',
    password: '123456Ab@',
  }

  // POST '/api/v1/auth/register'
  it('should register a new user', async () => {
    const { body } = await request(testServer.app)
      .post('/api/v1/auth/register')
      .send(registerUserDto)
      .expect(201)

    const { password, ...user } = registerUserDto
    expect(body.data.user).toEqual(
      expect.objectContaining({
        ...user,
      })
    )
  })

  // POST '/api/v1/auth/login'
  it('should login a user', async () => {
    const userEntity = userRepository.create({
      ...registerUserDto,
      password: bcryptAdapter.hash(registerUserDto.password),
    })
    await userRepository.save(userEntity)
    const { body } = await request(testServer.app)
      .post('/api/v1/auth/login')
      .send(loginUserDto)
      .expect(200)

    const { password, ...user } = registerUserDto
    expect(body.data.user).toEqual(
      expect.objectContaining({
        ...user,
      })
    )
  })
})
