import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  validateOrReject,
} from 'class-validator'

import { longNameLength, RFC_REGEX } from '@core/constants'
import { plainToInstance } from 'class-transformer'

export class CreateProviderDto {
  @IsOptional()
  @IsEmail()
  emailAddress?: string

  @IsString()
  @Length(1, longNameLength)
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
