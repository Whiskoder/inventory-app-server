import { plainToInstance } from 'class-transformer'
import { IsEnum, IsOptional, validateOrReject } from 'class-validator'

enum Property {
  category = 'category',
  product_prices = 'productPrices',
}

export class RelationsProductDto {
  @IsOptional()
  @IsEnum(Property, { each: true })
  include: Property[] = []

  public static async create(obj: {
    [key: string]: any
  }): Promise<RelationsProductDto> {
    const dto = plainToInstance(RelationsProductDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
