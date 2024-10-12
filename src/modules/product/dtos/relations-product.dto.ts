import { plainToInstance, Transform } from 'class-transformer'
import { IsEnum, IsOptional, validateOrReject } from 'class-validator'

enum Property {
  category = 'category',
  brand = 'brand',
  branches = 'branches',
}

export class RelationsProductDto {
  @Transform(({ value }) => value.split(','))
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
