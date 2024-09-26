import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { LoginUserDto } from '@modules/auth/dtos'

describe('login-user.dto.test.ts', () => {
  it('should return a LoginUserDto', async () => {
    const dto = {
      email: 'PKJBwS1f8dJ-byGUmnmlK@example.com',
      password: 'test123456',
    }
    const loginUserDto = await LoginUserDto.create(dto)
    expect(loginUserDto).toBeInstanceOf(LoginUserDto)
    expect(loginUserDto).toEqual(dto)
  })

  it('should throw an error if email is not valid email', async () => {
    const dto = {
      email: 'null',
      password: 'null',
    }
    const loginUserDto = plainToInstance(LoginUserDto, dto)
    const errors = await validate(loginUserDto)
    expect(errors.length).toBeGreaterThan(0)
  })
})
