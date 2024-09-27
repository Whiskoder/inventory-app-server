import { plainToInstance, Type } from 'class-transformer'
import {
  IsDateString,
  IsInt,
  IsPositive,
  validateOrReject,
} from 'class-validator'

export class CreateOrderDto {
  @IsDateString()
  deliveryDate!: Date

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  branchId!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateOrderDto> {
    const dto = plainToInstance(CreateOrderDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
