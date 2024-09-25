import { plainToInstance } from 'class-transformer'
import { IsEnum, IsOptional, IsString, validateOrReject } from 'class-validator'

export enum OrderBy {
  asc = 'asc',
  desc = 'desc',
}

export class CreateSortingDto {
  @IsOptional()
  @IsString()
  sortBy?: string

  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateSortingDto> {
    const dto = plainToInstance(CreateSortingDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
