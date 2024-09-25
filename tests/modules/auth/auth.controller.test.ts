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

  // beforeEach(async () => {
  //   await userRepository.delete({})
  // })

  // afterAll(async () => {
  //   await userRepository.delete({})
  //   await testServer.close()
  //   await AppDataSource.destroy()
  // })

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
      .then(() => testServer.close())
      .then(() => done())
      .catch(done) // Pass error to done if it fails
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

  it('should register a new user and login same user', async () => {
    // POST '/api/v1/auth/register'
    const { body } = await request(testServer.app)
      .post('/api/v1/auth/register')
      .send(registerUserDto)
      .expect(201)
  })

  it('should login a user', async () => {
    const userEntity = userRepository.create({
      ...registerUserDto,
      password: bcryptAdapter.hash(registerUserDto.password),
    })
    await userRepository.save(userEntity)
    // POST '/api/v1/auth/login'
    const response = await request(testServer.app)
      .post('/api/v1/auth/login')
      .send(loginUserDto)
      .expect(200)
  })
})
