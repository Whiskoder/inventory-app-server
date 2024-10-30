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

export class FilterInvoiceDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  ltePaymentDate?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  gtePaymentDate?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  lteTotalAmount?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  gteTotalAmount?: number

  @IsString()
  @IsOptional()
  equalsFolio?: string

  @IsString()
  @IsOptional()
  likeFolio?: string

  constructor(parsedQuery: { [key: string]: any }) {
    this.ltePaymentDate = +parsedQuery?.paymentDate?.lte || undefined
    this.gtePaymentDate = +parsedQuery?.paymentDate?.gte || undefined
    this.lteTotalAmount = +parsedQuery?.totalAmount?.lte || undefined
    this.gteTotalAmount = +parsedQuery?.totalAmount?.gte || undefined
    this.equalsFolio = parsedQuery?.folio?.equals
    this.likeFolio = parsedQuery?.folio?.like
  }

  public static async create(obj: {
    [key: string]: any
  }): Promise<FilterInvoiceDto> {
    const parsedQuery = qs.parse(obj)
    const dto = new FilterInvoiceDto(parsedQuery)
    await validateOrReject(dto)

    if (dto.equalsFolio && dto.likeFolio)
      throw new BadRequestException(ErrorMessages.LikeEqualsConflict)

    dto.equalsFolio = dto.equalsFolio?.trim().toUpperCase()
    dto.likeFolio = dto.likeFolio?.trim().toUpperCase()

    return dto
  }
}
