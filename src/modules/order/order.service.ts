import {
  Between,
  Equal,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm'

import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@core/errors'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'
import {
  CreateOrderDto,
  CreateOrderItemDto,
  FilterOrderDto,
  RelationsOrderDto,
  UpdateOrderDto,
  UpdateOrderItemDto,
  DeleteMultipleOrderItemsDto,
} from '@modules/order/dtos'
import {
  CreateHTTPResponseDto,
  CreatePaginationDto,
  CreateSortingDto,
} from '@modules/shared/dtos'
import { Order, OrderItem } from '@modules/order/models'
import { OrderStatus } from '@modules/order/enums'
import { Branch } from '@modules/branch/models'
import { User } from '@modules/user/models'
import { Roles } from '@modules/user/enums'
import { ErrorMessages } from '@modules/shared/enums/messages'
import { Product } from '@modules/product/models'
import { EmailService, SendMailOptions } from '@modules/emails/services'
import {
  orderUpdateEmail,
  OrderUpdateEmailProps,
} from '@modules/emails/templates'

// TODO: move to plugins
import { format } from 'date-fns'
import { es as esLocale } from 'date-fns/locale/es'

export class OrderService {
  constructor(
    private readonly orderRepository: Repository<Order>,
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly productsRepository: Repository<Product>,
    private readonly branchRepository: Repository<Branch>,
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService
  ) {}

  public async createOrder(
    createOrderDto: CreateOrderDto,
    userEntity: User
  ): Promise<CreateHTTPResponseDto> {
    const { branchId, deliveryDate } = createOrderDto

    const branchEntity = await this.branchRepository.findOne({
      where: { id: branchId, isActive: true },
    })

    if (!branchEntity)
      throw new BadRequestException('Branch provided not found')

    const orderEntity = this.orderRepository.create({
      deliveryDate,
      user: userEntity,
      folio: this.generateFolio(),
      branch: branchEntity,
    })
    await this.orderRepository.save(orderEntity)

    return CreateHTTPResponseDto.created('Order created successfully', {
      orders: [orderEntity],
    })
  }

  public async placeOrder(
    orderId: number,
    userEntity: User
  ): Promise<CreateHTTPResponseDto> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['branch'],
    })
    if (!orderEntity) throw new NotFoundException('Order not found')

    const { status: orderStatus } = orderEntity
    const { role: userRole } = userEntity

    if (orderStatus > OrderStatus.OPEN)
      throw new BadRequestException('Order already placed')

    const isBranchManager = userRole === Roles.BRANCH_MANAGER
    const isAdmin = userRole === Roles.ADMIN

    if (isBranchManager || isAdmin) {
      const response = await this.updateOrderStatus(orderId, OrderStatus.SENT)

      // Notify users
      const users = await this.userRepository.find({
        where: { role: Roles.WAREHOUSE_MANAGER },
      })

      const { folio } = orderEntity

      users.forEach(async ({ email, firstName }) => {
        const deliveryDate = format(
          orderEntity.deliveryDate,
          'EEEE, MMMM dd, yyyy',
          { locale: esLocale }
        )

        const { name, streetName, dependantLocality, cityName, postalCode } =
          orderEntity.branch
        const items = [streetName, dependantLocality, cityName, postalCode]

        const address =
          items.reduce((address, item) => {
            if (item) address = `${address}, ${item}`
            return address
          }, name) ?? ''

        const props: OrderUpdateEmailProps = {
          address,
          deliveryDate,
          username: firstName,
          downloadOrderLink: `orders/pdf/${folio}`,
          folio,
        }
        const htmlBody = await orderUpdateEmail(props)
        console.log(props)

        const options: SendMailOptions = {
          htmlBody,
          to: email,
          subject: `Tienes un nuevo pedido - ${orderEntity.folio}`,
          from: 'no-responder@sistemasdealimentacion.com.mx',
        }
        this.emailService.sendEmail(options)
      })

      return response
    }

    throw new ForbiddenException(ErrorMessages.ForbiddenException)
  }

  // An order can only be canceled if it has not been sent by the warehouse.
  // The order can only be canceled by the warehouse,
  // and the manager can only request the cancellation.
  public async cancelOrder(
    orderId: number,
    userEntity: User
  ): Promise<CreateHTTPResponseDto> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
    })
    if (!orderEntity) throw new NotFoundException('Order not found')

    const { status: orderStatus } = orderEntity

    if (orderStatus === OrderStatus.CANCELLED)
      throw new BadRequestException('Order already cancelled')

    if (orderStatus === OrderStatus.CANCEL_REQUESTED)
      throw new BadRequestException(
        'Order aldeady has a cancel request in progress'
      )

    if (orderStatus >= OrderStatus.DELIVERED)
      throw new BadRequestException('Cannot cancel order')

    const { role: userRole } = userEntity
    const isWarehouseManager = userRole === Roles.WAREHOUSE_MANAGER
    const isBranchManager = userRole === Roles.BRANCH_MANAGER
    const isAdmin = userRole === Roles.ADMIN

    if (isWarehouseManager || isAdmin)
      return await this.updateOrderStatus(orderId, OrderStatus.CANCELLED)

    if (isBranchManager || isAdmin)
      return await this.updateOrderStatus(orderId, OrderStatus.CANCELLED)

    throw new ForbiddenException(ErrorMessages.ForbiddenException)
  }

  public async getOrderList(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto,
    relationsDto: RelationsOrderDto,
    filterDto: FilterOrderDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip } = paginationDto
    const { orderBy, sortBy } = sortingDto

    const [orders, totalItems] = await this.orderRepository.findAndCount({
      take: limit,
      skip,
      where: this.createFilter(filterDto),
      order: { [sortBy]: orderBy },
      relations: [...relationsDto.include],
    })

    const pagination = CalculatePaginationUseCase({
      skip,
      limit,
      totalItems,
    })

    if (orders.length === 0) throw new NotFoundException('Orders not found')

    return CreateHTTPResponseDto.ok(undefined, { orders, pagination })
  }

  public async getOrderById(
    orderId: number,
    relationsDto: RelationsOrderDto
  ): Promise<CreateHTTPResponseDto> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [...relationsDto.include],
    })

    if (!orderEntity) throw new NotFoundException('Order not found')

    return CreateHTTPResponseDto.ok(undefined, { orders: [orderEntity] })
  }

  // TODO: Only update the order items if warehouseman accepts
  public async updateOrder(
    orderId: number,
    userEntity: User,
    updateOrderDto: UpdateOrderDto
  ): Promise<CreateHTTPResponseDto> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
    })
    if (!orderEntity) throw new NotFoundException('Order not found')

    const { status: orderStauts } = orderEntity
    if (orderStauts !== OrderStatus.OPEN)
      throw new BadRequestException('Only draft orders can be updated')

    const updatedOrder = await this.orderRepository.update(
      { id: orderId },
      updateOrderDto
    )

    if (!updatedOrder.affected)
      throw new InternalServerErrorException('Error updating order')

    return CreateHTTPResponseDto.ok('Order updated successfully')
  }

  public async deleteOrder(orderId: number): Promise<CreateHTTPResponseDto> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
    })
    if (!orderEntity) throw new NotFoundException('Order not found')

    if (orderEntity.status !== OrderStatus.OPEN)
      throw new BadRequestException('Only draft orders can be deleted')

    const deleteOrder = await this.orderRepository.delete({ id: orderId })

    if (!deleteOrder.affected)
      throw new InternalServerErrorException('Error deleting order')

    return CreateHTTPResponseDto.noContent()
  }

  public async createMultipleOrderItems(
    createOrderItemsDto: CreateOrderItemDto[],
    orderId: number
  ): Promise<CreateHTTPResponseDto> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    })
    if (!orderEntity) throw new NotFoundException('Order not found')

    const ids = createOrderItemsDto.map(({ productPriceId }) => productPriceId)
    const products = await this.productsRepository.findBy({
      id: In(ids),
    })

    const { orderItems: existingOrderItems, status } = orderEntity

    if (status !== OrderStatus.OPEN)
      throw new BadRequestException('Only draft orders can be modified')

    const filteredOrderItems = products.filter(({ id }) => {
      const exclude = existingOrderItems?.findIndex(
        ({ product }) => product.id === id
      )
      return exclude === -1
    })

    const orderItemsEntities = filteredOrderItems.map((product) => {
      const orderItemDto = createOrderItemsDto.find(
        ({ productPriceId }) => productPriceId === product.id
      )
      return this.orderItemsRepository.create({
        product,
        measurementUnit: product.measureUnit,
        basePriceAtOrder: product.pricePerUnit,
        quantityRequested: orderItemDto?.quantityRequested,
        order: orderEntity,
      })
    })

    await this.orderItemsRepository.save(orderItemsEntities)
    await this.updateOrderItems(orderId)

    return CreateHTTPResponseDto.created('Order items placed')
  }

  public async updateMultipleOrderItems(
    updateOrderItemsDto: UpdateOrderItemDto[],
    orderId: number
  ): Promise<CreateHTTPResponseDto> {
    const orderItemIds = updateOrderItemsDto.map(
      ({ orderItemId }) => orderItemId
    )
    const itemsToUpdate = await this.checkOrderItemExists(orderId, orderItemIds)

    updateOrderItemsDto.map(({ quantityRequested, orderItemId }) => {
      if (itemsToUpdate.some((id) => id === orderItemId)) {
        const orderItemEntity = this.orderItemsRepository.create({
          quantityRequested,
        })
        this.orderItemsRepository.update({ id: orderItemId }, orderItemEntity)
      }
    })

    await this.updateOrderItems(orderId)

    return CreateHTTPResponseDto.ok('Order items updated successfully')
  }

  public async deleteOrderItem(
    orderId: number,
    deleteMultipleOrderItemsDto: DeleteMultipleOrderItemsDto
  ): Promise<CreateHTTPResponseDto> {
    const ids = await this.checkOrderItemExists(
      orderId,
      deleteMultipleOrderItemsDto.orderItemIds
    )

    const deletedOrderItem = await this.orderItemsRepository.delete({
      id: In(ids),
    })

    if (!deletedOrderItem.affected)
      throw new InternalServerErrorException('Failed to delete order item')

    await this.updateOrderItems(orderId)

    return CreateHTTPResponseDto.noContent()
  }

  private async updateOrderItems(orderId: number) {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems'],
    })

    if (!orderEntity)
      throw new InternalServerErrorException('Failed to update order')

    const totalItems = orderEntity.orderItems?.length
    let totalPriceAmount = 0

    orderEntity.orderItems?.map(({ basePriceAtOrder, quantityRequested }) => {
      totalPriceAmount = totalPriceAmount + basePriceAtOrder * quantityRequested
    })

    const updatedOrderEntity = this.orderRepository.create({
      totalItems,
      totalPriceAmount,
    })
    return this.orderRepository.update(
      { id: orderEntity.id },
      updatedOrderEntity
    )
  }

  private async checkOrderItemExists(orderId: number, orderItemIds: number[]) {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems'],
    })

    if (!orderEntity) throw new NotFoundException('Order not found')

    const { status: orderStatus } = orderEntity
    if (orderStatus !== OrderStatus.OPEN)
      throw new BadRequestException('Only draft orders can be modified')

    const { orderItems } = orderEntity

    if (!orderItems)
      throw new BadRequestException('Theres no items in the order to update')

    const existingItems = orderItemIds.filter((currentItemId) => {
      return orderItems.some(
        (existingItems) => currentItemId === existingItems.id
      )
    })

    return existingItems
  }

  private async updateOrderStatus(
    orderId: number,
    orderStatus: OrderStatus
  ): Promise<CreateHTTPResponseDto> {
    const updatedOrder = await this.orderRepository.update(
      { id: orderId },
      { status: orderStatus }
    )

    if (!updatedOrder.affected)
      throw new InternalServerErrorException('Error updating order')

    return CreateHTTPResponseDto.ok('Order status updated', { orderStatus })
  }

  private generateFolio() {
    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    const randomDigits = Math.floor(10 + Math.random() * 90)
    const folio = `F${randomDigits}-${month}${year}`
    return folio
  }

  private createFilter(filterDto: FilterOrderDto) {
    const where: { [key: string]: any } = {}

    const {
      lteCompletedAt,
      lteCreatedAt,
      lteDeliveryDate,
      lteTotalPriceAmount,
      gteCompletedAt,
      gteCreatedAt,
      gteDeliveryDate,
      gteTotalPriceAmount,
      equalsOrderStatus,
      likeFolio,
      equalsFolio,
    } = filterDto

    const addRangeCondition = (
      key: string,
      lte: string | number | undefined,
      gte: string | number | undefined
    ) => {
      if (lte && gte) {
        if (typeof lte === 'string') {
          const f = 'yyyy-MM-dd HH:MM:SS'
          where[key] = Between(
            format(new Date(gte), f),
            format(new Date(lte), f)
          )
          return
        }
        where[key] = Between(gte, gte)
        return
      }

      if (lte) where[key] = LessThanOrEqual(lte)
      if (gte) where[key] = MoreThanOrEqual(gte)
    }

    addRangeCondition('completedAt', lteCompletedAt, gteCompletedAt)
    addRangeCondition('createdAt', lteCreatedAt, gteCreatedAt)
    addRangeCondition('deliveryDate', lteDeliveryDate, gteDeliveryDate)
    addRangeCondition(
      'totalPriceAmount',
      lteTotalPriceAmount,
      gteTotalPriceAmount
    )

    if (equalsOrderStatus) where.orderStatus = Equal(equalsOrderStatus)
    if (likeFolio) where.folio = Like(`${likeFolio}`)
    if (equalsFolio) where.folio = Equal(equalsFolio)

    return where
  }
}
