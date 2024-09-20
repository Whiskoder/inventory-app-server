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
import { BadRequestException } from '@/core/errors'
import { ErrorMessages } from '@core/enums/messages'

export class UpdateProductDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(10000)
  @Max(99999)
  barCode!: number

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  categoryId!: number

  @IsOptional()
  @IsString()
  @IsEnum(MeasureUnit)
  measureUnit!: string

  @IsOptional()
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
  }): Promise<UpdateProductDto> {
    if (!obj) throw new BadRequestException(ErrorMessages.EmptyBody)

    const { barCode, categoryId, measureUnit, name, stock } = obj
    const dto = plainToInstance(UpdateProductDto, {
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
