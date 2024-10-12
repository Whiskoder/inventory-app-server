import { plainToInstance, Transform } from 'class-transformer'
import { IsEnum, IsOptional, validateOrReject } from 'class-validator'

enum Property {
  product = 'products',
}

export class RelationsCategoryDto {
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsEnum(Property, { each: true })
  include: Property[] = []

  public static async create(obj: {
    [key: string]: any
  }): Promise<RelationsCategoryDto> {
    const dto = plainToInstance(RelationsCategoryDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
