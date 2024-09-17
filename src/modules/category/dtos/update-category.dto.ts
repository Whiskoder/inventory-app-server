import {
  IsString,
  MaxLength,
  MinLength,
  validateOrReject,
} from 'class-validator'

export class UpdateCategoryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
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
