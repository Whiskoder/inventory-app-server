import { plainToInstance } from 'class-transformer'
import { IsDateString, validateOrReject } from 'class-validator'

export class CreateOrderDto {
  @IsDateString()
  deliveryDate!: Date

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateOrderDto> {
    const dto = plainToInstance(CreateOrderDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
