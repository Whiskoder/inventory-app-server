import { BadRequestException } from '@/core/errors'
import { plainToInstance } from 'class-transformer'
import { IsEnum, IsOptional, IsString, validateOrReject } from 'class-validator'

export enum OrderBy {
  asc = 'asc',
  desc = 'desc',
}

export class CreateSortingDto {
  @IsOptional()
  @IsString()
  sortBy: string = 'id'

  @IsOptional()
  @IsEnum(OrderBy)
  orderBy: OrderBy = OrderBy.asc

  public static async create(
    obj: {
      [key: string]: any
    },
    props: string[]
  ): Promise<CreateSortingDto> {
    const dto = plainToInstance(CreateSortingDto, obj)
    await validateOrReject(dto)
    if (dto.sortBy.trim().length === 0) dto.sortBy = 'id'
    dto.sortBy = dto.sortBy.trim()
    props.push('id')
    if (props.indexOf(dto.sortBy) === -1)
      throw new BadRequestException(
        `Provided sort property doesnt exist, use one of the following: ${props?.join(
          ', '
        )}`
      )
    return dto
  }
}
