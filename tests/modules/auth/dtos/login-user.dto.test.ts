import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { LoginUserDto } from '@modules/auth/dtos'

describe('login-user.dto.test.ts', () => {
  it('should return a LoginUserDto', async () => {
    const dto = {
      email: 'test@example.com',
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
    expect(errors.length).not.toBe(0)
  })
})
