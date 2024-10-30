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
import { Order } from '@modules/order/models'

export class InvoiceService {
  constructor(
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly orderRepository: Repository<Order>
  ) {}

  public async createInvoice(
    createInvoiceDto: CreateInvoiceDto
  ): Promise<CreateHTTPResponseDto> {
    const { folio } = createInvoiceDto

    const orderEntity = await this.orderRepository.findOne({ where: { folio } })

    if (!orderEntity) throw new BadRequestException('Order not found')

    const invoiceEntity = this.invoiceRepository.create({
      ...createInvoiceDto,
      order: orderEntity,
    })
    await this.invoiceRepository.save(invoiceEntity)

    return CreateHTTPResponseDto.created('Invoice created succesfully', {
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
    const updatedInvoice = await this.invoiceRepository.update(
      { id: invoiceId },
      invoiceEntity
    )

    if (!updatedInvoice.affected)
      throw new NotFoundException('Invoice not found')

    return CreateHTTPResponseDto.ok('Invoice updated successfully', {
      invoices: [{ ...invoiceEntity, id: invoiceId }],
    })
  }

  private createFilter(filterDto: FilterInvoiceDto) {
    const where: { [key: string]: any } = {}

    const {
      ltePaymentDate,
      lteTotalAmount,
      gtePaymentDate,
      gteTotalAmount,
      likeFolio,
      equalsFolio,
    } = filterDto

    if (ltePaymentDate) where.paymentDate = LessThanOrEqual(ltePaymentDate)
    if (gtePaymentDate) where.paymentDate = MoreThanOrEqual(gtePaymentDate)

    if (lteTotalAmount) where.totalAmount = LessThanOrEqual(lteTotalAmount)
    if (gteTotalAmount) where.totalAmount = MoreThanOrEqual(gteTotalAmount)

    if (likeFolio) where.folio = Like(`${likeFolio}`)
    if (equalsFolio) where.folio = Equal(equalsFolio)

    return where
  }
}
