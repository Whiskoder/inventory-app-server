import { plainToInstance, Type } from 'class-transformer'
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  validateOrReject,
} from 'class-validator'

export class RegisterUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(55)
  firstName!: string

  @IsString()
  @MinLength(1)
  @MaxLength(55)
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
