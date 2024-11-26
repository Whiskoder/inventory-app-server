import { plainToInstance, Transform } from 'class-transformer'
import { IsEnum, IsOptional, validateOrReject } from 'class-validator'

enum Property {
  orderItems = 'orderItems',
  orderItemsProduct = 'orderItems.product',
  invoices = 'invoices',
  branch = 'branch',
  user = 'user',
}

export class RelationsOrderDto {
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsEnum(Property, { each: true })
  include: Property[] = []

  public static async create(obj: {
    [key: string]: any
  }): Promise<RelationsOrderDto> {
    const dto = plainToInstance(RelationsOrderDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
