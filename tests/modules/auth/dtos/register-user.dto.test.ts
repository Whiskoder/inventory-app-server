import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { RegisterUserDto } from '@modules/auth/dtos'

describe('register-user.dto.test.ts', () => {
  it('should return a RegisterUserDto', async () => {
    const dto: RegisterUserDto = {
      contactPhone: '+522742458721',
      email: 'slRTvyffaJOnePkmD2_Z2@gmail.com',
      firstName: 'Juan',
      lastName: 'Gonzales Hernandez',
      password: '123456Ab@',
    }
    const registerUserDto = await RegisterUserDto.create(dto)
    expect(registerUserDto).toBeInstanceOf(RegisterUserDto)
    expect(registerUserDto).toEqual(dto)
  })

  it('should throw an error', async () => {
    const dto: RegisterUserDto = {
      contactPhone: 'null',
      email: 'null',
      firstName: '',
      lastName: '',
      password: 'null',
    }
    const registerUserDto = plainToInstance(RegisterUserDto, dto)
    const errors = await validate(registerUserDto)
    expect(errors.length).not.toBe(0)
  })
})
