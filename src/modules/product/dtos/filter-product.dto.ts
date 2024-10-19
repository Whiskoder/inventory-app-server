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
  likeBrandName?: string

  @IsString()
  @IsOptional()
  equalsCategoryName?: string

  @IsString()
  @IsOptional()
  likeCategoryName?: string

  @IsString()
  @IsOptional()
  equalsBrandName?: string

  @IsString()
  @IsOptional()
  equalsMeasureUnit?: string

  @IsNumber()
  @IsPositive()
  @IsOptional()
  ltePricePerUnit?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  gtePricePerUnit?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  lteMinUnits?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  gteMinUnits?: number

  constructor(parsedQuery: { [key: string]: any }) {
    this.likeName = parsedQuery?.name?.like
    this.equalsName = parsedQuery?.name?.equals

    this.likeBrandName = parsedQuery?.brand?.like
    this.equalsBrandName = parsedQuery?.brand?.equals

    this.likeCategoryName = parsedQuery?.category?.like
    this.equalsCategoryName = parsedQuery?.category?.equals

    this.equalsMeasureUnit = parsedQuery?.measureUnit?.equals

    this.ltePricePerUnit = +parsedQuery?.pricePerUnit?.lte || undefined
    this.gtePricePerUnit = +parsedQuery?.pricePerUnit?.gte || undefined

    this.lteMinUnits = +parsedQuery?.minUnits?.lte || undefined
    this.gteMinUnits = +parsedQuery?.minUnits?.gte || undefined
  }

  public static async create(obj: {
    [key: string]: any
  }): Promise<FilterProductDto> {
    const parsedQuery = qs.parse(obj)
    const dto = new FilterProductDto(parsedQuery)
    await validateOrReject(dto)

    if (
      (dto.likeName && dto.equalsName) ||
      (dto.likeBrandName && dto.equalsBrandName) ||
      (dto.likeCategoryName && dto.equalsCategoryName)
    )
      throw new BadRequestException(ErrorMessages.LikeEqualsConflict)

    dto.likeName = dto.likeName?.trim().toLowerCase()
    dto.equalsName = dto.equalsName?.trim().toLowerCase()

    dto.likeBrandName = dto.likeBrandName?.trim().toLowerCase()
    dto.equalsBrandName = dto.equalsBrandName?.trim().toLowerCase()

    dto.likeCategoryName = dto.likeCategoryName?.trim().toLowerCase()
    dto.equalsCategoryName = dto.equalsCategoryName?.trim().toLowerCase()

    dto.equalsMeasureUnit = dto.equalsMeasureUnit?.trim().toLowerCase()

    return dto
  }
}
