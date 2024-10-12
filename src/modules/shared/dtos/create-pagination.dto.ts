import { plainToInstance, Type } from 'class-transformer'
import {
  IsInt,
  IsOptional,
  IsPositive,
  validateOrReject,
} from 'class-validator'

export class CreatePaginationDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  page: number = 1

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit: number = 10

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  skip!: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreatePaginationDto> {
    const dto = plainToInstance(CreatePaginationDto, obj)
    await validateOrReject(dto)
    if (!dto.skip) dto.skip = (dto.page - 1) * dto.limit
    return dto
  }
}
