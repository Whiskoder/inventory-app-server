import { IsString, Length, validateOrReject } from 'class-validator'
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '@core/constants'

export class UpdateCategoryDto {
  @IsString()
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH)
  name!: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateCategoryDto> {
    const { name } = obj || {}

    const dto = new UpdateCategoryDto()
    dto.name = name

    await validateOrReject(dto)
    return dto
  }
}
