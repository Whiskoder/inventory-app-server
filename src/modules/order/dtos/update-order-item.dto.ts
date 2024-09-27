import { plainToInstance, Type } from 'class-transformer'
import { IsNumber, IsPositive, validateOrReject } from 'class-validator'

export class UpdateOrderItemDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantityRequested!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateOrderItemDto> {
    const dto = plainToInstance(UpdateOrderItemDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
