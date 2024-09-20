import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  validateOrReject,
} from 'class-validator'

import { MAX_NAME_LENGTH, MIN_NAME_LENGTH, RFC_REGEX } from '@core/constants'
import { plainToInstance } from 'class-transformer'

export class CreateProviderDto {
  @IsOptional()
  @IsEmail()
  emailAddress?: string

  @IsString()
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH)
  name!: string

  //! FIX THIS
  @IsOptional()
  @IsPhoneNumber('MX')
  phone?: number

  @Matches(RFC_REGEX)
  rfc!: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateProviderDto> {
    const { emailAddress, name, phone, rfc } = obj || {}

    const dto = plainToInstance(CreateProviderDto, {
      emailAddress,
      name,
      phone,
      rfc,
    })

    await validateOrReject(dto)

    return dto
  }
}
