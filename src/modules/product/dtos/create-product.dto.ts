import { plainToInstance, Type } from 'class-transformer'
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  validateOrReject,
} from 'class-validator'

import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '@/core/constants'
import { MeasureUnit } from '@core/enums'

export class CreateProductDto {
  @Type(() => Number)
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

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  stock!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateProductDto> {
    const { barCode, categoryId, measureUnit, name, stock = 0 } = obj || {}
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
