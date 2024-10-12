import { plainToInstance, Type } from 'class-transformer'
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  validateOrReject,
} from 'class-validator'

import { longNameLength } from '@modules/shared/constants'
import { MeasureUnit } from '@modules/product/enums'

export class CreateProductDto {
  @IsEnum(MeasureUnit)
  measureUnit!: MeasureUnit

  @IsString()
  @Length(1, longNameLength)
  name!: string

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerUnit!: number

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  minUnits!: number

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  brandId!: number

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateProductDto> {
    const dto = plainToInstance(CreateProductDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
