import { plainToInstance, Type } from 'class-transformer'
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  validateOrReject,
} from 'class-validator'

import { longNameLength } from '@modules/shared/constants'
import { MeasureUnit } from '@modules/product/enums'
export class UpdateProductDto {
  @IsOptional()
  @IsEnum(MeasureUnit)
  measurementUnit?: MeasureUnit

  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  name?: string

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  categoryId?: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateProductDto> {
    const dto = plainToInstance(UpdateProductDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
