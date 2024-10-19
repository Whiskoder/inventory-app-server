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

    dto.sortBy = dto.sortBy.trim()
    if (dto.sortBy.length === 0) dto.sortBy = 'id' // Set id as default

    CreateSortingDto.validateSortByProps(props, dto.sortBy)

    return dto
  }

  private static validateSortByProps(props: string[], sortBy: string) {
    const sortByProps = [...props, 'id']
    if (sortByProps.indexOf(sortBy) === -1)
      throw new BadRequestException(
        `Sort property is unknown, use one of the following: ${props?.join(
          ', '
        )}`
      )
  }
}
