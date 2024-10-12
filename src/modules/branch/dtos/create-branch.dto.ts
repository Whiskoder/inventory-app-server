import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  Length,
  validateOrReject,
} from 'class-validator'

import {
  emailLength,
  longNameLength,
  shortNameLength,
} from '@/modules/shared/constants'
import { plainToInstance } from 'class-transformer'

export class CreateBranchDto {
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

  @IsString()
  @Length(1, longNameLength)
  name!: string

  @IsOptional()
  @IsPostalCode('MX')
  postalCode?: string

  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  streetName?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateBranchDto> {
    const dto = plainToInstance(CreateBranchDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
