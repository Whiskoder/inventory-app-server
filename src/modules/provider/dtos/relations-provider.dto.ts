import { plainToInstance, Transform } from 'class-transformer'
import { IsEnum, IsOptional, validateOrReject } from 'class-validator'

enum Property {
  invoice = 'invoices',
}

export class RelationsProviderDto {
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsEnum(Property, { each: true })
  include: Property[] = []

  public static async create(obj: {
    [key: string]: any
  }): Promise<RelationsProviderDto> {
    const dto = plainToInstance(RelationsProviderDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
