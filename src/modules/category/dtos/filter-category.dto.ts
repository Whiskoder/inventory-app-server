import qs from 'qs'
import { IsOptional, IsString, validateOrReject } from 'class-validator'

import { BadRequestException } from '@core/errors'
import { ErrorMessages } from '@modules/shared/enums/messages'

export class FilterCategoryDto {
  @IsString()
  @IsOptional()
  equalsName?: string

  @IsString()
  @IsOptional()
  likeName?: string

  constructor(parsedQuery: { [key: string]: any }) {
    this.equalsName = parsedQuery?.name?.equals
    this.likeName = parsedQuery?.name?.like
  }

  public static async create(obj: {
    [key: string]: any
  }): Promise<FilterCategoryDto> {
    const parsedQuery = qs.parse(obj)
    const dto = new FilterCategoryDto(parsedQuery)
    await validateOrReject(dto)

    if (dto.equalsName && dto.likeName)
      throw new BadRequestException(ErrorMessages.LikeEqualsConflict)

    dto.equalsName = dto.equalsName?.trim().toLowerCase()
    dto.likeName = dto.likeName?.trim().toLowerCase()

    return dto
  }
}
