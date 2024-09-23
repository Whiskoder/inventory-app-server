import { plainToInstance } from 'class-transformer'
import { IsEnum, IsOptional, IsString, validateOrReject } from 'class-validator'

export enum OrderBy {
  asc = 'asc',
  desc = 'desc',
}

export class SortingDto {
  @IsOptional()
  @IsString()
  sortBy?: string

  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy

  public static async create(obj: { [key: string]: any }): Promise<SortingDto> {
    const dto = plainToInstance(SortingDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
