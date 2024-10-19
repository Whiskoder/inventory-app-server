import qs from 'qs'
import { IsOptional, IsString, validateOrReject } from 'class-validator'

import { BadRequestException } from '@core/errors'
import { ErrorMessages } from '@modules/shared/enums/messages'

export class FilterProviderDto {
  @IsString()
  @IsOptional()
  equalsCityName?: string

  @IsString()
  @IsOptional()
  likeCityName?: string

  @IsString()
  @IsOptional()
  equalsContactEmail?: string

  @IsString()
  @IsOptional()
  likeContactEmail?: string

  @IsString()
  @IsOptional()
  equalsContactPhone?: string

  @IsString()
  @IsOptional()
  likeContactPhone?: string

  @IsString()
  @IsOptional()
  equalsDependantLocality?: string

  @IsString()
  @IsOptional()
  likeDependantLocality?: string

  @IsString()
  @IsOptional()
  equalsName?: string

  @IsString()
  @IsOptional()
  likeName?: string

  @IsString()
  @IsOptional()
  equalsStreetName?: string

  @IsString()
  @IsOptional()
  likeStreetName?: string

  @IsString()
  @IsOptional()
  equalsPostalCode?: string

  @IsString()
  @IsOptional()
  equalsRfc?: string

  constructor(parsedQuery: { [key: string]: any }) {
    this.equalsCityName = parsedQuery?.cityName?.equals
    this.likeCityName = parsedQuery?.cityName?.like

    this.equalsContactEmail = parsedQuery?.contactEmail?.equals
    this.likeContactEmail = parsedQuery?.contactEmail?.like

    this.equalsContactPhone = parsedQuery?.contactPhone?.equals
    this.likeContactPhone = parsedQuery?.contactPhone?.like

    this.equalsDependantLocality = parsedQuery?.dependantLocality?.equals
    this.likeDependantLocality = parsedQuery?.dependantLocality?.like

    this.equalsName = parsedQuery?.name?.equals
    this.likeName = parsedQuery?.name?.like

    this.equalsStreetName = parsedQuery?.streetName?.equals
    this.likeStreetName = parsedQuery?.streetName?.like

    this.equalsPostalCode = parsedQuery?.postalCode?.equals
    this.equalsRfc = parsedQuery?.rfc?.equals
  }

  public static async create(obj: {
    [key: string]: any
  }): Promise<FilterProviderDto> {
    const parsedQuery = qs.parse(obj)
    const dto = new FilterProviderDto(parsedQuery)
    await validateOrReject(dto)

    if (
      (dto.equalsCityName && dto.likeCityName) ||
      (dto.equalsContactEmail && dto.likeContactEmail) ||
      (dto.equalsContactPhone && dto.likeContactPhone) ||
      (dto.equalsDependantLocality && dto.likeDependantLocality) ||
      (dto.equalsName && dto.likeName)
    )
      throw new BadRequestException(ErrorMessages.LikeEqualsConflict)

    dto.equalsCityName = dto.equalsCityName?.trim().toLowerCase()
    dto.likeCityName = dto.likeCityName?.trim().toLowerCase()

    dto.equalsContactEmail = dto.equalsContactEmail?.trim().toLowerCase()
    dto.likeContactEmail = dto.likeContactEmail?.trim().toLowerCase()

    dto.equalsContactPhone = dto.equalsContactPhone?.trim().toLowerCase()
    dto.likeContactPhone = dto.likeContactPhone?.trim().toLowerCase()

    dto.equalsDependantLocality = dto.equalsDependantLocality
      ?.trim()
      .toLowerCase()
    dto.equalsDependantLocality = dto.equalsDependantLocality
      ?.trim()
      .toLowerCase()

    dto.equalsName = dto.equalsName?.trim().toLowerCase()
    dto.likeName = dto.likeName?.trim().toLowerCase()

    dto.equalsStreetName = dto.equalsStreetName?.trim().toLowerCase()
    dto.likeStreetName = dto.likeStreetName?.trim().toLowerCase()

    dto.equalsPostalCode = dto.equalsPostalCode?.trim()
    dto.equalsRfc = dto.equalsRfc?.trim().toUpperCase()

    return dto
  }
}
