import { plainToInstance, Type } from 'class-transformer'
import { IsNumber, Min, validateOrReject } from 'class-validator'

import { BadRequestException } from '@core/errors'

export class UpdateProductPriceDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerUnit!: number

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minUnitQuantity!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateProductPriceDto> {
    if (!obj)
      throw new BadRequestException('You need to update at least one property')

    const { pricePerUnit, minUnitQuantity } = obj
    const dto = plainToInstance(UpdateProductPriceDto, {
      pricePerUnit,
      minUnitQuantity,
    })
    await validateOrReject(dto)

    return dto
  }
}
