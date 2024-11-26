import { plainToInstance } from 'class-transformer'
import { IsDateString, IsOptional, validateOrReject } from 'class-validator'

export class UpdateOrderDto {
  @IsOptional()
  @IsDateString()
  deliveryDate?: Date

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateOrderDto> {
    const dto = plainToInstance(UpdateOrderDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
