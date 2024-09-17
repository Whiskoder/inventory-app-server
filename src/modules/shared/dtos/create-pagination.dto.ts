import { plainToInstance, Type } from 'class-transformer'
import { IsInt, IsPositive, validateOrReject } from 'class-validator'

export class CreatePaginationDto {
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
  }): Promise<CreatePaginationDto> {
    const { page = 1, limit = 10 } = obj || {}

    const dto = plainToInstance(CreatePaginationDto, { page, limit })

    await validateOrReject(dto)
    dto.skip = (dto.page - 1) * dto.limit
    return dto
  }
}
