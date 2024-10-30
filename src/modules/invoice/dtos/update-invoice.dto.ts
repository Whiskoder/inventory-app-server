import { IsString, validateOrReject } from 'class-validator'
import { plainToInstance } from 'class-transformer'

export class UpdateInvoiceDto {
  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateInvoiceDto> {
    const dto = plainToInstance(UpdateInvoiceDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
