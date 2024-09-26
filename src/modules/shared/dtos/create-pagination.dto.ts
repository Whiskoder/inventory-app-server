import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsInt, IsPositive, validateOrReject } from 'class-validator'

export class CreatePaginationDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number = 1

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit: number = 10

  @Transform(({ obj }) => (obj.page - 1) * obj.limit)
  skip!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreatePaginationDto> {
    const dto = plainToInstance(CreatePaginationDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
