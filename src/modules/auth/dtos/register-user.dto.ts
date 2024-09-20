import { plainToInstance, Type } from 'class-transformer'
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  validateOrReject,
} from 'class-validator'

import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '@core/constants'

export class RegisterUserDto {
  @IsString()
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH)
  firstName!: string

  @IsString()
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH)
  @IsOptional()
  lastName?: string

  @IsEmail()
  emailAddress!: string

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string

  @Type(() => Number)
  @IsOptional()
  @IsPhoneNumber('MX')
  phone?: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<RegisterUserDto> {
    const {
      emailAddress = '',
      firstName = '',
      lastName,
      password = '',
      phone,
    } = obj || {}

    const dto = plainToInstance(RegisterUserDto, {
      emailAddress,
      firstName,
      lastName,
      password,
      phone,
    })

    await validateOrReject(dto)
    return dto
  }
}
