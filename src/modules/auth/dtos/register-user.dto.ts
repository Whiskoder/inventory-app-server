import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  validateOrReject,
} from 'class-validator'

import { longNameLength } from '@core/constants'
import { plainToInstance } from 'class-transformer'

export class RegisterUserDto {
  @IsOptional()
  @IsPhoneNumber('MX')
  contactPhone?: string

  @IsEmail()
  email!: string

  @IsString()
  @Length(1, longNameLength)
  firstName!: string

  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  lastName?: string

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<RegisterUserDto> {
    const dto = plainToInstance(RegisterUserDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
