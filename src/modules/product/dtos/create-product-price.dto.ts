import { plainToInstance, Type } from 'class-transformer'
import {
  IsInt,
  IsNumber,
  IsPositive,
  Min,
  validateOrReject,
} from 'class-validator'

export class CreateProductPriceDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerUnit!: number

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minUnitQuantity!: number

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  providerId!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateProductPriceDto> {
    const { pricePerUnit, minUnitQuantity, providerId } = obj || {}
    const dto = plainToInstance(CreateProductPriceDto, {
      pricePerUnit,
      minUnitQuantity,
      providerId,
    })
    await validateOrReject(dto)

    return dto
  }
}
