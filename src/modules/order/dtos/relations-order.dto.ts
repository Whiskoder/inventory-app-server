import { plainToInstance } from 'class-transformer'
import { IsEnum, IsOptional, validateOrReject } from 'class-validator'

enum Property {
  order_item = 'orderItems',
  invoice = 'invoices',
  branch = 'branch',
  user = 'user',
}

export class RelationsOrderDto {
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
