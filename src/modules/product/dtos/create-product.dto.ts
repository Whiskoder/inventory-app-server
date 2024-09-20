import { plainToInstance, Type } from 'class-transformer'
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  validateOrReject,
} from 'class-validator'

import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '@core/constants'
import { MeasureUnit } from '@modules/product/enums'

export class CreateProductDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(10000)
  @Max(99999)
  barCode!: number

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId!: number

  @IsString()
  @IsEnum(MeasureUnit)
  measureUnit!: string

  @IsString()
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH)
  name!: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  stock!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateProductDto> {
    const { barCode, categoryId, measureUnit, name, stock } = obj || {}
    const dto = plainToInstance(CreateProductDto, {
      barCode,
      categoryId,
      measureUnit,
      name,
      stock,
    })
    await validateOrReject(dto)

    return dto
  }
}
