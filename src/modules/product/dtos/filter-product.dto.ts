import qs from 'qs'
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  validateOrReject,
} from 'class-validator'

import { BadRequestException } from '@core/errors'
import { ErrorMessages } from '@modules/shared/enums/messages'

export class FilterProductDto {
  @IsString()
  @IsOptional()
  likeName?: string

  @IsString()
  @IsOptional()
  equalsName?: string

  @IsString()
  @IsOptional()
  likeBrand?: string

  @IsString()
  @IsOptional()
  equalsCategory?: string

  @IsString()
  @IsOptional()
  likeCategory?: string

  @IsString()
  @IsOptional()
  equalsBrand?: string

  @IsString()
  @IsOptional()
  equalsMeasureUnit?: string

  @IsNumber()
  @IsPositive()
  @IsOptional()
  lteUnitPrice?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  gteUnitPrice?: number

  constructor(parsedQuery: { [key: string]: any }) {
    this.likeName = parsedQuery?.name?.like
    this.equalsName = parsedQuery?.name?.equals

    this.likeBrand = parsedQuery?.brand?.like
    this.equalsBrand = parsedQuery?.brand?.equals

    this.likeCategory = parsedQuery?.category?.like
    this.equalsCategory = parsedQuery?.category?.equals

    this.equalsMeasureUnit = parsedQuery?.measureUnit?.equals

    this.lteUnitPrice = +parsedQuery?.pricePerUnit?.lte || undefined
    this.gteUnitPrice = +parsedQuery?.pricePerUnit?.gte || undefined
  }

  public static async create(obj: {
    [key: string]: any
  }): Promise<FilterProductDto> {
    const parsedQuery = qs.parse(obj)
    const dto = new FilterProductDto(parsedQuery)
    await validateOrReject(dto)

    if (
      (dto.likeName && dto.equalsName) ||
      (dto.likeBrand && dto.equalsBrand) ||
      (dto.likeCategory && dto.equalsCategory)
    )
      throw new BadRequestException(ErrorMessages.LikeEqualsConflict)

    dto.likeName = dto.likeName?.trim().toLowerCase()
    dto.equalsName = dto.equalsName?.trim().toLowerCase()

    dto.likeBrand = dto.likeBrand?.trim().toLowerCase()
    dto.equalsBrand = dto.equalsBrand?.trim().toLowerCase()

    dto.likeCategory = dto.likeCategory?.trim().toLowerCase()
    dto.equalsCategory = dto.equalsCategory?.trim().toLowerCase()

    dto.equalsMeasureUnit = dto.equalsMeasureUnit?.trim().toLowerCase()

    return dto
  }
}
