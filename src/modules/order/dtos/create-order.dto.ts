import { plainToInstance } from 'class-transformer'
import {
  IsDate,
  IsDateString,
  IsInt,
  IsPositive,
  validateOrReject,
} from 'class-validator'

export class CreateOrderDto {
  @IsDateString()
  deliveryDate!: Date

  @IsInt()
  @IsPositive()
  restaurantId!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateOrderDto> {
    const { deliveryDate, restaurantId } = obj || {}

    const dto = plainToInstance(CreateOrderDto, {
      deliveryDate,
      restaurantId,
    })
    await validateOrReject(dto)

    return dto
  }
}
