import { plainToInstance, Type } from 'class-transformer'
import {
  IsArray,
  IsInt,
  IsNumber,
  IsPositive,
  validateOrReject,
} from 'class-validator'

export class CreateOrderItemDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantityRequested!: number

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  productPriceId!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateOrderItemDto> {
    const dto = plainToInstance(CreateOrderItemDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
