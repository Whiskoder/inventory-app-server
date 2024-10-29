import { validateOrReject } from 'class-validator'
import { plainToInstance } from 'class-transformer'

export class CreateInvoiceDto {
  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateInvoiceDto> {
    const dto = plainToInstance(CreateInvoiceDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
