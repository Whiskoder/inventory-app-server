import { plainToInstance, Type } from 'class-transformer'
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  validateOrReject,
} from 'class-validator'

import { codeLength, longNameLength } from '@modules/shared/constants'
import { MeasureUnit } from '@modules/product/enums'
export class UpdateProductDto {
  @IsOptional()
  @IsEnum(MeasureUnit)
  measureUnit?: MeasureUnit

  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  name?: string

  @IsOptional()
  @IsString()
  @Length(1, codeLength)
  code?: string

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  unitPrice!: number

  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  brand!: string

  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  category?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateProductDto> {
    const dto = plainToInstance(UpdateProductDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
