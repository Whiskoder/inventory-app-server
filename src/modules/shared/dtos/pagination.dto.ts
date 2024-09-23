import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsInt, IsPositive, validateOrReject } from 'class-validator'

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page!: number

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit!: number

  @Transform(({ obj }) => (obj.page - 1) * obj.limit)
  skip!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<PaginationDto> {
    const dto = plainToInstance(PaginationDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
