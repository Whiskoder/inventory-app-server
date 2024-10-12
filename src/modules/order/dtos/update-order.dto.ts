import { plainToInstance, Type } from 'class-transformer'
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  validateOrReject,
} from 'class-validator'

export class UpdateOrderDto {
  @IsOptional()
  @IsDateString()
  deliveryDate?: Date

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  restaurantId?: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateOrderDto> {
    const dto = plainToInstance(UpdateOrderDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
