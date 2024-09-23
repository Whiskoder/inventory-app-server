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

import { descriptionLength, longNameLength } from '@core/constants'
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
  @Length(1, longNameLength)
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
