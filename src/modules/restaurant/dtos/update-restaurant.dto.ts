import { IsOptional, IsString, Length, validateOrReject } from 'class-validator'

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MIN_NAME_LENGTH,
} from '@core/constants'

export class UpdateRestaurantDto {
  @IsString()
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH)
  name!: string

  @IsString()
  @Length(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH)
  @IsOptional()
  location?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateRestaurantDto> {
    const { name, location } = obj || {}

    const dto = new UpdateRestaurantDto()
    dto.name = name
    dto.location = location

    await validateOrReject(dto)
    return dto
  }
}
