import { plainToInstance } from 'class-transformer'
import { IsEmail, IsString, MinLength, validateOrReject } from 'class-validator'

export class LoginUserDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<LoginUserDto> {
    const dto = plainToInstance(LoginUserDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
