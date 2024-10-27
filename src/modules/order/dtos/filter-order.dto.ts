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

export class FilterOrderDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  lteCreatedAt?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  gteCreatedAt?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  lteDeliveryDate?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  gteDeliveryDate?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  lteCompletedAt?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  gteCompletedAt?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  lteTotalPriceAmount?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  gteTotalPriceAmount?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  equalsOrderStatus?: number

  @IsString()
  @IsOptional()
  equalsFolio?: string

  @IsString()
  @IsOptional()
  likeFolio?: string

  constructor(parsedQuery: { [key: string]: any }) {
    this.lteCreatedAt = +parsedQuery?.createdAt?.lte || undefined
    this.gteCreatedAt = +parsedQuery?.createdAt?.gte || undefined
    this.lteDeliveryDate = +parsedQuery?.deliveryDate?.lte || undefined
    this.gteDeliveryDate = +parsedQuery?.deliveryDate?.gte || undefined
    this.lteCompletedAt = +parsedQuery?.completedAt?.lte || undefined
    this.gteCompletedAt = +parsedQuery?.completedAt?.gte || undefined
    this.lteTotalPriceAmount = +parsedQuery?.totalPriceAmount?.lte || undefined
    this.gteTotalPriceAmount = +parsedQuery?.totalPriceAmount?.gte || undefined
    this.equalsOrderStatus = +parsedQuery?.orderStatus?.equals || undefined
    this.equalsFolio = parsedQuery?.folio?.equals
    this.likeFolio = parsedQuery?.folio?.like
  }

  public static async create(obj: {
    [key: string]: any
  }): Promise<FilterOrderDto> {
    const parsedQuery = qs.parse(obj)
    const dto = new FilterOrderDto(parsedQuery)
    await validateOrReject(dto)

    if (dto.equalsFolio && dto.likeFolio)
      throw new BadRequestException(ErrorMessages.LikeEqualsConflict)

    dto.equalsFolio = dto.equalsFolio?.trim().toLowerCase()
    dto.likeFolio = dto.likeFolio?.trim().toLowerCase()

    return dto
  }
}
