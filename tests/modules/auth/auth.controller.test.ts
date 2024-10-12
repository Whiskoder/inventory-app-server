import request from 'supertest'
import { Repository } from 'typeorm'

import { testServer } from '../../../tests/build-server'
import { LoginUserDto, RegisterUserDto } from '@modules/auth/dtos'
import { AppDataSource } from '@core/datasources'
import { User } from '@modules/user/models'
import { bcryptAdapter } from '@config/plugins'

describe('auth.controller.test.ts', () => {
  let userRepository: Repository<User>

  const clearRepositoryTables = async () => {
    await userRepository.delete({})
  }

  beforeAll(async () => {
    await testServer.start()
    await AppDataSource.initialize()

    userRepository = AppDataSource.getRepository(User)

    await clearRepositoryTables()
  })

  afterAll(async () => {
    await clearRepositoryTables()
    await testServer.close()
    await AppDataSource.destroy()
  })

  // POST '/api/v1/auth/register'
  it('should register a new user', async () => {
    const registerUserDto: RegisterUserDto = {
      contactPhone: '+522742458721',
      email: '7HSihJeIElChO9lVr4reN@gmail.com',
      firstName: 'Juan',
      lastName: 'Gonzales Hernandez',
      password: '123456Ab@',
    }

    await request(testServer.app)
      .post('/api/v1/auth/register')
      .send(registerUserDto)
      .expect(201)
  })

  // POST '/api/v1/auth/login'
  it('should login a user', async () => {
    const registerUserDto: RegisterUserDto = {
      contactPhone: '+522742458721',
      email: 'k16AYeXgp6zMx6S4iew17@gmail.com',
      firstName: 'Juan',
      lastName: 'Gonzales Hernandez',
      password: '123456Ab@',
    }
    const loginUserDto: LoginUserDto = {
      email: 'k16AYeXgp6zMx6S4iew17@gmail.com',
      password: '123456Ab@',
    }

    const userEntity = userRepository.create({
      ...registerUserDto,
      password: bcryptAdapter.hash(registerUserDto.password),
    })
    await userRepository.save(userEntity)

    await request(testServer.app)
      .post('/api/v1/auth/login')
      .send(loginUserDto)
      .expect(200)
  })
})
