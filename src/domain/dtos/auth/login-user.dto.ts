import { IsEmail, IsString, MinLength, validateOrReject } from 'class-validator'

export class LoginUserDto {
  @IsEmail()
  emailAddress!: string

  @IsString()
  @MinLength(8)
  password!: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<LoginUserDto> {
    const { emailAddress, password } = obj || {}

    const dto = new LoginUserDto()
    dto.emailAddress = emailAddress
    dto.password = password

    await validateOrReject(dto)
    return dto
  }
}
