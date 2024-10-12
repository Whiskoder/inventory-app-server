import { IsString, Length, validateOrReject } from 'class-validator'
import { plainToInstance } from 'class-transformer'

import { shortNameLength } from '@modules/shared/constants'

export class UpdateCategoryDto {
  @IsString()
  @Length(1, shortNameLength)
  name?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateCategoryDto> {
    const dto = plainToInstance(UpdateCategoryDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
