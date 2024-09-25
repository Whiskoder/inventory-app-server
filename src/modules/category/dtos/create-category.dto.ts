import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  validateOrReject,
} from 'class-validator'
import { plainToInstance } from 'class-transformer'

import { descriptionLength, shortNameLength } from '@modules/shared/constants'
import { AppIcons } from '@modules/shared/enums'

export class CreateCategoryDto {
  @IsString()
  @Length(1, shortNameLength)
  name!: string

  @IsOptional()
  @IsEnum(AppIcons)
  iconName?: AppIcons

  @IsOptional()
  @IsString()
  @Length(1, descriptionLength)
  description?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateCategoryDto> {
    const dto = plainToInstance(CreateCategoryDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
