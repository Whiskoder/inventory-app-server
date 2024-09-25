import { plainToInstance, Type } from 'class-transformer'
import { IsNumber, IsOptional, Min, validateOrReject } from 'class-validator'

export class UpdateProductPriceDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basePrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity?: number

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateProductPriceDto> {
    const dto = plainToInstance(UpdateProductPriceDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
