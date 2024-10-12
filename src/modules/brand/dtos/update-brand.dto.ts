import { IsOptional, IsString, Length, validateOrReject } from 'class-validator'

import { longNameLength } from '@/modules/shared/constants'
import { plainToInstance } from 'class-transformer'

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  @Length(1, longNameLength)
  name?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateBrandDto> {
    const dto = plainToInstance(UpdateBrandDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
