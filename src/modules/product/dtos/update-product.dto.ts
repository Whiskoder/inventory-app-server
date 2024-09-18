import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

export class UpdateProductDto {
  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateProductDto> {
    const {} = obj || {}
    const dto = plainToInstance(UpdateProductDto, {})
    await validateOrReject(dto)

    return dto
  }
}
