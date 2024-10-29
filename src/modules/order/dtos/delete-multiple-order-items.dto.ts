import { plainToInstance, Type } from 'class-transformer'
import {
  isArray,
  IsArray,
  IsNumber,
  IsPositive,
  validateOrReject,
} from 'class-validator'

export class DeleteMultipleOrderItemsDto {
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  orderItemIds!: number[]

  public static async create(obj: {
    [key: string]: any
  }): Promise<DeleteMultipleOrderItemsDto> {
    const dto = plainToInstance(DeleteMultipleOrderItemsDto, obj)
    await validateOrReject(dto)
    if (!isArray(dto.orderItemIds)) {
      dto.orderItemIds = [dto.orderItemIds]
    }
    return dto
  }
}
