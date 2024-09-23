import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  Length,
  validateOrReject,
} from 'class-validator'

import { longNameLength, shortNameLength } from '@core/constants'
import { plainToInstance } from 'class-transformer'

export class UpdateBranchDto {
  @IsOptional()
  @IsString()
  @Length(1, shortNameLength)
  cityName?: string

  @IsOptional()
  @IsString()
  @IsEmail()
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
  @Length(1, longNameLength)
  name?: string

  @IsOptional()
  @IsPostalCode('MX')
  postalCode?: string

  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  streetName?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateBranchDto> {
    const dto = plainToInstance(UpdateBranchDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
