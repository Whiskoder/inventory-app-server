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
import { BadRequestException } from '@core/errors'
import { ErrorMessages } from '@core/enums/messages'

export class UpdateProviderDto {
  @IsOptional()
  @IsEmail()
  emailAddress?: string

  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  name?: string

  @IsOptional()
  @IsPhoneNumber('MX')
  phone?: number

  @IsOptional()
  @Matches(RFC_REGEX)
  rfc?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateProviderDto> {
    if (!obj) throw new BadRequestException(ErrorMessages.EmptyBody)

    const { emailAddress, name, phone, rfc } = obj

    const dto = plainToInstance(UpdateProviderDto, {
      emailAddress,
      name,
      phone,
      rfc,
    })

    await validateOrReject(dto)

    return dto
  }
}
