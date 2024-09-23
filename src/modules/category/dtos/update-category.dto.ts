import { IsOptional, IsString, Length, validateOrReject } from 'class-validator'

import { descriptionLength, shortNameLength } from '@core/constants'
import { plainToInstance } from 'class-transformer'

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Length(1, shortNameLength)
  name!: string

  @IsOptional()
  @IsString()
  @Length(1, shortNameLength)
  iconName?: string

  @IsOptional()
  @IsString()
  @Length(1, descriptionLength)
  description?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateCategoryDto> {
    // const { name } = obj || {}

    // const dto = new UpdateCategoryDto()
    // dto.name = name
    const dto = plainToInstance(UpdateCategoryDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
