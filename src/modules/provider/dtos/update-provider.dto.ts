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
import { BadRequestException } from '@core/errors'
import { ErrorMessages } from '@core/enums/messages'

export class UpdateProviderDto {
  @IsOptional()
  @IsEmail()
  emailAddress?: string

  @IsOptional()
  @IsString()
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH)
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
