import { plainToInstance } from 'class-transformer'
import { IsArray, validateOrReject } from 'class-validator'
import { UpdateOrderItemDto } from '@modules/order/dtos'

export class UpdateMultipleOrderItemsDto {
  @IsArray()
  items!: UpdateOrderItemDto[]

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateOrderItemDto[]> {
    const dto = plainToInstance(UpdateMultipleOrderItemsDto, obj)
    await validateOrReject(dto)
    const dtos = await Promise.all(
      dto.items.map((item) => UpdateOrderItemDto.create(item))
    )
    return dtos
  }
}
