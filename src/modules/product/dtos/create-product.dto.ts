import { plainToInstance, Type } from 'class-transformer'
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  validateOrReject,
} from 'class-validator'

import { codeLength, longNameLength } from '@modules/shared/constants'
import { MeasureUnit } from '@modules/product/enums'

export class CreateProductDto {
  @IsEnum(MeasureUnit)
  measureUnit!: MeasureUnit

  @IsString()
  @Length(1, longNameLength)
  name!: string

  @IsString()
  @Length(1, codeLength)
  code!: string

  @Type(() => Number)
  @IsNumber()
  unitPrice!: number

  @Length(1, longNameLength)
  @IsString()
  @IsOptional()
  brand!: string

  @Length(1, longNameLength)
  @IsString()
  @IsOptional()
  category!: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateProductDto> {
    const dto = plainToInstance(CreateProductDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
