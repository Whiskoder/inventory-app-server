import { IsOptional, IsString, Length, validateOrReject } from 'class-validator'

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MIN_NAME_LENGTH,
} from '@core/constants'
import { BadRequestException } from '@core/errors'
import { ErrorMessages } from '@core/enums/messages'

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH)
  name!: string

  @IsOptional()
  @IsString()
  @Length(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH)
  location?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateRestaurantDto> {
    if (!obj) throw new BadRequestException(ErrorMessages.EmptyBody)

    const { name, location } = obj

    const dto = new UpdateRestaurantDto()
    dto.name = name
    dto.location = location

    await validateOrReject(dto)
    return dto
  }
}
