import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '@core/constants'
import { IsString, Length, validateOrReject } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH)
  name!: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateCategoryDto> {
    const { name } = obj || {}

    const dto = new CreateCategoryDto()
    dto.name = name

    await validateOrReject(dto)
    return dto
  }
}
