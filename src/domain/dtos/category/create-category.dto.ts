import {
  IsString,
  MaxLength,
  MinLength,
  validateOrReject,
} from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
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
