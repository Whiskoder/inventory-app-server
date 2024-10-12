import { plainToInstance, Type } from 'class-transformer'
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

  skip!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreatePaginationDto> {
    const dto = plainToInstance(CreatePaginationDto, obj)
    await validateOrReject(dto)
    dto.skip = (dto.page - 1) * dto.limit
    return dto
  }
}
