import { plainToInstance } from 'class-transformer'
import { IsEnum, IsOptional, validateOrReject } from 'class-validator'

enum Property {}

export class RelationsBrandDto {
  @IsOptional()
  @IsEnum(Property, { each: true })
  include: Property[] = []

  public static async create(obj: {
    [key: string]: any
  }): Promise<RelationsBrandDto> {
    const dto = plainToInstance(RelationsBrandDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
