import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  validateOrReject,
} from 'class-validator'
import { plainToInstance } from 'class-transformer'

import {
  descriptionLength,
  emailLength,
  longNameLength,
  postalCodeLength,
  RFC_REGEX,
  shortNameLength,
} from '@modules/shared/constants'
export class UpdateProviderDto {
  @IsOptional()
  @IsString()
  @Length(1, shortNameLength)
  cityName?: string

  @IsOptional()
  @IsEmail()
  @Length(1, emailLength)
  contactEmail?: string

  @IsOptional()
  @IsPhoneNumber('MX')
  contactPhone?: string

  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  dependantLocality?: string

  @IsOptional()
  @IsString()
  @Length(1, descriptionLength)
  description?: string

  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  name!: string

  @IsOptional()
  @Length(1, postalCodeLength)
  postalCode?: string

  @IsOptional()
  @Matches(RFC_REGEX)
  rfc!: string

  @IsOptional()
  @Length(1, longNameLength)
  streetName?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateProviderDto> {
    const dto = plainToInstance(UpdateProviderDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
