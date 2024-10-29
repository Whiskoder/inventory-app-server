import {
  Equal,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm'

import {
  CreateHTTPResponseDto,
  CreatePaginationDto,
  CreateSortingDto,
} from '@modules/shared/dtos'
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@core/errors'
import { Invoice } from '@modules/invoice/models'
import {
  CreateInvoiceDto,
  FilterInvoiceDto,
  RelationsInvoiceDto,
  UpdateInvoiceDto,
} from '@modules/invoice/dtos'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'
import { UUID } from '@config/plugins'

export class InvoiceService {
  constructor(private readonly invoiceRepository: Repository<Invoice>) {}

  public async createInvoice(
    createInvoiceDto: CreateInvoiceDto
  ): Promise<CreateHTTPResponseDto> {
    const invoiceEntity = this.invoiceRepository.create(createInvoiceDto)
    await this.invoiceRepository.save(invoiceEntity)

    return CreateHTTPResponseDto.created('invoice created succesfully', {
      invoices: [invoiceEntity],
    })
  }

  public async getInvoiceById(
    invoiceId: number,
    relationsDto: RelationsInvoiceDto
  ): Promise<CreateHTTPResponseDto> {
    const invoiceEntity = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: [...relationsDto.include],
    })

    if (!invoiceEntity) throw new NotFoundException('Invoice not found')
    return CreateHTTPResponseDto.ok(undefined, { invoices: [invoiceEntity] })
  }

  public async getInvoiceList(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto,
    relationsDto: RelationsInvoiceDto,
    filterDto: FilterInvoiceDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip } = paginationDto
    const { orderBy, sortBy } = sortingDto

    const [invoices, totalItems] = await this.invoiceRepository.findAndCount({
      take: limit,
      skip,
      where: this.createFilter(filterDto),
      relations: [...relationsDto.include],
      order: { [sortBy]: orderBy },
    })

    const pagination = CalculatePaginationUseCase({
      skip,
      limit,
      totalItems,
    })

    if (invoices.length === 0) throw new NotFoundException('Invoice not found')

    return CreateHTTPResponseDto.ok(undefined, {
      invoices,
      pagination,
    })
  }

  public async updateInvoice(
    invoiceId: number,
    updateInvoiceDto: UpdateInvoiceDto
  ): Promise<CreateHTTPResponseDto> {
    const invoiceEntity = this.invoiceRepository.create(updateInvoiceDto)
    const updatedinvoice = await this.invoiceRepository.update(
      { id: invoiceId },
      invoiceEntity
    )

    if (!updatedinvoice.affected)
      throw new NotFoundException('Invoice not found')

    return CreateHTTPResponseDto.ok('Invoice updated successfully', {
      invoices: [{ ...invoiceEntity, id: invoiceId }],
    })
  }

  private createFilter(filterDto: FilterInvoiceDto) {
    const where: { [key: string]: any } = {}

    const { ltePaymentDate, lteTotalAmount, gtePaymentDate, gteTotalAmount } =
      filterDto

    if (ltePaymentDate) where.paymentDate = LessThanOrEqual(ltePaymentDate)
    if (gtePaymentDate) where.paymentDate = MoreThanOrEqual(gtePaymentDate)

    if (lteTotalAmount) where.totalAmount = LessThanOrEqual(lteTotalAmount)
    if (gteTotalAmount) where.totalAmount = MoreThanOrEqual(gteTotalAmount)

    return where
  }
}
