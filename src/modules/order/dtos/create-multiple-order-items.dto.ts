import { plainToInstance } from 'class-transformer'
import { IsArray, validateOrReject } from 'class-validator'
import { CreateOrderItemDto } from '@modules/order/dtos'

export class CreateMultipleOrderItemsDto {
  @IsArray()
  items!: CreateOrderItemDto[]

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateOrderItemDto[]> {
    const dto = plainToInstance(CreateMultipleOrderItemsDto, obj)
    await validateOrReject(dto)
    const dtos = await Promise.all(
      dto.items.map((item) => CreateOrderItemDto.create(item))
    )
    return dtos
  }
}
