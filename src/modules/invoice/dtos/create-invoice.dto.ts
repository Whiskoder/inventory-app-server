import { IsPositive, IsString, validateOrReject } from 'class-validator'
import { plainToInstance, Type } from 'class-transformer'

export class CreateInvoiceDto {
  @IsString()
  folio!: string

  @Type(() => Number)
  @IsPositive()
  totalAmount!: number

  @IsString()
  fileUrl!: string

  @IsString()
  fileExtension!: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<CreateInvoiceDto> {
    const dto = plainToInstance(CreateInvoiceDto, obj)
    await validateOrReject(dto)
    return dto
  }
}
