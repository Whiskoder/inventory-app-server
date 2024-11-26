import { plainToInstance } from 'class-transformer'
import { IsArray, validateOrReject } from 'class-validator'

import { CreateProductDto } from '@modules/product/dtos'

export class CreateMultipleProductsDto {
  @IsArray()
  products!: CreateProductDto[]

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateProductDto[]> {
    const dto = plainToInstance(CreateMultipleProductsDto, obj)
    await validateOrReject(dto)
    const dtos = await Promise.all(
      dto.products.map((product) => CreateProductDto.create(product))
    )
    return dtos
  }
}
