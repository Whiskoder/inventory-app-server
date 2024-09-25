import { plainToInstance, Type } from 'class-transformer'
import {
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  Length,
  validateOrReject,
} from 'class-validator'

import { longNameLength } from '@modules/shared/constants'
import { MeasureUnit } from '@modules/product/enums'

export class CreateProductDto {
  @IsEnum(MeasureUnit)
  measurementUnit!: MeasureUnit

  @IsString()
  @Length(1, longNameLength)
  name!: string

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
