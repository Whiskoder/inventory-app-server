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
  basePrice!: number

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity!: number

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  providerId!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateProductPriceDto> {
    const dto = plainToInstance(CreateProductPriceDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
