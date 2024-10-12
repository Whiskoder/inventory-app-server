import { IsString, Length, validateOrReject } from 'class-validator'
import { plainToInstance } from 'class-transformer'

import { shortNameLength } from '@modules/shared/constants'

export class CreateCategoryDto {
  @IsString()
  @Length(1, shortNameLength)
  name!: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateCategoryDto> {
    const dto = plainToInstance(CreateCategoryDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
