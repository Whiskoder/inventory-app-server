import { plainToInstance, Transform } from 'class-transformer'
import { IsEnum, IsOptional, validateOrReject } from 'class-validator'

enum Property {
  order = 'orders',
}

export class RelationsBranchDto {
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsEnum(Property, { each: true })
  include: Property[] = []

  public static async create(obj: {
    [key: string]: any
  }): Promise<RelationsBranchDto> {
    const dto = plainToInstance(RelationsBranchDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
