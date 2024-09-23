import { IsOptional, IsString, Length, validateOrReject } from 'class-validator'

import { descriptionLength, shortNameLength } from '@core/constants'
import { plainToInstance } from 'class-transformer'

export class CreateCategoryDto {
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
  }): Promise<CreateCategoryDto> {
    // const { name } = obj || {}

    // const dto = new CreateCategoryDto()
    // dto.name = name
    const dto = plainToInstance(CreateCategoryDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
