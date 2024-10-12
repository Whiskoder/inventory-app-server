import { IsString, Length, validateOrReject } from 'class-validator'

import { longNameLength } from '@/modules/shared/constants'
import { plainToInstance } from 'class-transformer'

export class CreateBrandDto {
  @IsString()
  @Length(1, longNameLength)
  name!: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateBrandDto> {
    const dto = plainToInstance(CreateBrandDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
