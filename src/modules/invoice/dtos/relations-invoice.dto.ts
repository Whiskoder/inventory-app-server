import { plainToInstance, Transform } from 'class-transformer'
import { IsEnum, IsOptional, validateOrReject } from 'class-validator'

enum Property {
  order = 'order',
  provider = 'provider',
}

export class RelationsInvoiceDto {
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsEnum(Property, { each: true })
  include: Property[] = []

  public static async create(obj: {
    [key: string]: any
  }): Promise<RelationsInvoiceDto> {
    const dto = plainToInstance(RelationsInvoiceDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
