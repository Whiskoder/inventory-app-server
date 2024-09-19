import { plainToInstance, Type } from 'class-transformer'
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

  skip!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<PaginationDto> {
    const { page = 1, limit = 10 } = obj || {}

    const dto = plainToInstance(PaginationDto, { page, limit })
    await validateOrReject(dto)

    dto.skip = (dto.page - 1) * dto.limit

    return dto
  }
}
