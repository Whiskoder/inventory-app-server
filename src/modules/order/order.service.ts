import {
  Between,
  Equal,
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
} from '@modules/order/dtos'
import {
  CreateHTTPResponseDto,
  CreatePaginationDto,
  CreateSortingDto,
} from '@modules/shared/dtos'
import { Order, OrderItem } from '@modules/order/models'
import { OrderStatus } from '@modules/order/enums'
import { User } from '@modules/user/models'
import { Roles } from '@modules/user/enums'
import { ErrorMessages } from '@modules/shared/enums/messages'
import { Product } from '@modules/product/models'
import { EmailService } from '@modules/emails/services'
import { OrderEmailsUseCase } from '@modules/emails/use-cases'

interface ProcessOrderOptions {
  orderId: number
  userEntity: User
  expectedStatus: OrderStatus
  nextStatus: OrderStatus
  emailFunction: (
    emailService: EmailService,
    orderEntity: Order,
    userEntities: User[]
  ) => void
  isOwnerAuthRequired: boolean
  notifyToOwner: boolean
}

export class OrderService {
  private readonly WEEKLY_BUDGET = 50_000
  constructor(
    private readonly orderRepository: Repository<Order>,
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly productsRepository: Repository<Product>,
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService
  ) {}

  public async createOrder(
    createOrderDto: CreateOrderDto,
    userEntity: User
  ): Promise<CreateHTTPResponseDto> {
    const { deliveryDate } = createOrderDto

    if (!userEntity.branch) throw new BadRequestException('Branch not found')
    const branchEntity = userEntity.branch

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
    const { role: userRole } = userEntity
    const isAuthorized =
      userRole === Roles.BRANCH_MANAGER || userRole === Roles.ADMIN

    if (!isAuthorized)
      throw new ForbiddenException(ErrorMessages.ForbiddenException)

    return await this.processOrder({
      orderId,
      userEntity,
      expectedStatus: OrderStatus.OPEN,
      nextStatus: OrderStatus.SENT,
      emailFunction: OrderEmailsUseCase.sendCreatedOrderEmail,
      isOwnerAuthRequired: true,
      notifyToOwner: false,
    })
  }

  public async acceptOrder(
    orderId: number,
    userEntity: User
  ): Promise<CreateHTTPResponseDto> {
    const { role: userRole } = userEntity
    const isAuthorized =
      userRole === Roles.WAREHOUSE_MANAGER || userRole === Roles.ADMIN

    if (!isAuthorized)
      throw new ForbiddenException(ErrorMessages.ForbiddenException)

    return await this.processOrder({
      orderId,
      userEntity,
      expectedStatus: OrderStatus.SENT,
      nextStatus: OrderStatus.PROCESSING,
      emailFunction: OrderEmailsUseCase.sendCreatedOrderEmail,
      isOwnerAuthRequired: false,
      notifyToOwner: true,
    })
  }

  public async notifyOrderDelivery(
    orderId: number,
    userEntity: User
  ): Promise<CreateHTTPResponseDto> {
    const { role: userRole } = userEntity
    const isAuthorized =
      userRole === Roles.WAREHOUSE_MANAGER || userRole === Roles.ADMIN

    if (!isAuthorized)
      throw new ForbiddenException(ErrorMessages.ForbiddenException)

    return await this.processOrder({
      orderId,
      userEntity,
      expectedStatus: OrderStatus.PROCESSING,
      nextStatus: OrderStatus.DELIVERED,
      emailFunction: OrderEmailsUseCase.sendCreatedOrderEmail,
      isOwnerAuthRequired: false,
      notifyToOwner: true,
    })
  }

  public async completeOrder(
    orderId: number,
    userEntity: User
  ): Promise<CreateHTTPResponseDto> {
    return await this.processOrder({
      orderId,
      userEntity,
      expectedStatus: OrderStatus.DELIVERED,
      nextStatus: OrderStatus.COMPLETED,
      emailFunction: OrderEmailsUseCase.sendCreatedOrderEmail,
      isOwnerAuthRequired: true,
      notifyToOwner: false,
    })
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
      relations: ['user'],
    })
    if (!orderEntity) throw new NotFoundException('Order not found')

    const { status: orderStatus } = orderEntity

    if (
      orderStatus >= OrderStatus.DELIVERED &&
      orderStatus !== OrderStatus.CANCEL_REQUESTED
    )
      throw new BadRequestException('Cannot cancel order')

    const { role: userRole } = userEntity
    const isWarehouseManager = userRole === Roles.WAREHOUSE_MANAGER
    const isOrderOwner = userEntity.id === orderEntity.user.id
    const isAdmin = userRole === Roles.ADMIN

    if (isWarehouseManager || isAdmin)
      return await this.updateOrderStatus(orderId, OrderStatus.CANCELLED)

    if (isOrderOwner || isAdmin)
      return await this.updateOrderStatus(orderId, OrderStatus.CANCEL_REQUESTED)

    throw new ForbiddenException(ErrorMessages.ForbiddenException)
  }

  public async rejectCancelOrder(
    orderId: number,
    userEntity: User
  ): Promise<CreateHTTPResponseDto> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
    })
    if (!orderEntity) throw new NotFoundException('Order not found')

    const { status: orderStatus } = orderEntity

    if (orderStatus !== OrderStatus.CANCEL_REQUESTED)
      throw new BadRequestException('This action cannot be performed')

    const { role: userRole } = userEntity
    const isWarehouseManager = userRole === Roles.WAREHOUSE_MANAGER
    const isAdmin = userRole === Roles.ADMIN

    if (isWarehouseManager || isAdmin)
      return await this.updateOrderStatus(orderId, OrderStatus.PROCESSING)

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

  public async getOrderWeekBudget(
    date: string
  ): Promise<CreateHTTPResponseDto> {
    const { startDate, endDate } = this.calculateWeeklyRange(new Date(date))

    return CreateHTTPResponseDto.ok(undefined, {
      budget: await this.calculateWeeklyBudget(startDate, endDate),
    })
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

  public async createOrderItem(
    orderId: number,
    createOrderItemDto: CreateOrderItemDto
  ): Promise<CreateHTTPResponseDto> {
    const { quantityRequested, productId } = createOrderItemDto
    const { orderEntity, orderItems } = await this.checkOrderStatus(orderId)

    // Check if order item already exists
    if (orderItems.some(({ product }) => product.id === productId))
      throw new BadRequestException('Order item already exists')

    const product = await this.productsRepository.findOne({
      where: { id: productId },
    })

    if (!product) throw new NotFoundException('Product not found')

    const orderItemEntity = this.orderItemsRepository.create({
      quantityRequested,
      product,
      order: orderEntity,
    })

    await this.orderItemsRepository.save(orderItemEntity)
    await this.updateOrderTotal(orderId)

    const { order, ...orderItem } = orderItemEntity

    return CreateHTTPResponseDto.created('Order item created successfully', {
      items: [orderItem],
    })
  }

  public async updateOrderItem(
    orderId: number,
    orderItemId: number,
    updateOrderItemDto: UpdateOrderItemDto
  ): Promise<CreateHTTPResponseDto> {
    const { quantityRequested } = updateOrderItemDto
    const { orderItems, orderEntity } = await this.checkOrderStatus(orderId)

    const orderItem = orderItems.find(({ id }) => id === orderItemId)

    if (!orderItem) throw new NotFoundException('Order item not found')

    const orderItemEntity = this.orderItemsRepository.create({
      ...orderItem,
      quantityRequested,
    })

    await this.orderItemsRepository.update({ id: orderItemId }, orderItemEntity)
    await this.updateOrderTotal(orderId)

    return CreateHTTPResponseDto.ok('Order item updated successfully')
  }

  public async deleteOrderItem(
    orderId: number,
    orderItemId: number
  ): Promise<CreateHTTPResponseDto> {
    const { orderItems, orderEntity } = await this.checkOrderStatus(orderId)

    const orderItem = orderItems.find(({ id }) => id === orderItemId)
    if (!orderItem) throw new NotFoundException('Order item not found')

    await this.orderItemsRepository.delete({ id: orderItemId })
    await this.updateOrderTotal(orderId)

    return CreateHTTPResponseDto.noContent()
  }

  private async updateOrderTotal(orderId: number) {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems'],
    })

    if (!orderEntity) return

    const orderItems: OrderItem[] = orderEntity.orderItems ?? []

    const totalPriceAmount = orderItems.reduce((total, item) => {
      total += Number(item.total)
      return total
    }, 0)
    const totalItems = orderItems.length

    const updatedOrderEntity = this.orderRepository.create({
      totalItems,
      totalPriceAmount,
    })
    await this.orderRepository.update(
      { id: orderEntity.id },
      updatedOrderEntity
    )
  }

  private async checkOrderStatus(
    orderId: number
  ): Promise<{ orderItems: OrderItem[]; orderEntity: Order }> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    })

    if (!orderEntity) throw new NotFoundException('Order not found')

    const { status, orderItems = [] } = orderEntity

    if (status !== OrderStatus.OPEN)
      throw new BadRequestException('Only draft orders can be modified')

    return { orderItems, orderEntity }
  }
  // public async createMultipleOrderItems(
  //   createOrderItemsDto: CreateOrderItemDto[],
  //   orderId: number
  // ): Promise<CreateHTTPResponseDto> {
  //   const orderEntity = await this.orderRepository.findOne({
  //     where: { id: orderId },
  //     relations: ['orderItems', 'orderItems.product'],
  //   })
  //   if (!orderEntity) throw new NotFoundException('Order not found')

  //   const ids = createOrderItemsDto.map(({ productPriceId }) => productPriceId)
  //   const products = await this.productsRepository.findBy({
  //     id: In(ids),
  //   })

  //   const { orderItems: existingOrderItems, status } = orderEntity

  //   if (status !== OrderStatus.OPEN)
  //     throw new BadRequestException('Only draft orders can be modified')

  //   const filteredOrderItems = products.filter(({ id }) => {
  //     const exclude = existingOrderItems?.findIndex(
  //       ({ product }) => product.id === id
  //     )
  //     return exclude === -1
  //   })

  //   const orderItemsEntities = filteredOrderItems.map((product) => {
  //     const orderItemDto = createOrderItemsDto.find(
  //       ({ productPriceId }) => productPriceId === product.id
  //     )
  //     return this.orderItemsRepository.create({
  //       product,
  //       measurementUnit: product.measureUnit,
  //       basePriceAtOrder: product.unitPrice,
  //       quantityRequested: orderItemDto?.quantityRequested,
  //       order: orderEntity,
  //     })
  //   })

  //   await this.orderItemsRepository.save(orderItemsEntities)
  //   await this.updateOrderItems(orderId)

  //   return CreateHTTPResponseDto.created('Order items placed')
  // }

  // public async updateMultipleOrderItems(
  //   updateOrderItemsDto: UpdateOrderItemDto[],
  //   orderId: number
  // ): Promise<CreateHTTPResponseDto> {
  //   const orderItemIds = updateOrderItemsDto.map(
  //     ({ orderItemId }) => orderItemId
  //   )
  //   const itemsToUpdate = await this.checkOrderItemExists(orderId, orderItemIds)

  //   updateOrderItemsDto.map(({ quantityRequested, orderItemId }) => {
  //     if (itemsToUpdate.some((id) => id === orderItemId)) {
  //       const orderItemEntity = this.orderItemsRepository.create({
  //         quantityRequested,
  //       })
  //       this.orderItemsRepository.update({ id: orderItemId }, orderItemEntity)
  //     }
  //   })

  //   await this.updateOrderItems(orderId)

  //   return CreateHTTPResponseDto.ok('Order items updated successfully')
  // }

  // public async deleteOrderItem(
  //   orderId: number,
  //   deleteMultipleOrderItemsDto: DeleteMultipleOrderItemsDto
  // ): Promise<CreateHTTPResponseDto> {
  //   const ids = await this.checkOrderItemExists(
  //     orderId,
  //     deleteMultipleOrderItemsDto.orderItemIds
  //   )

  //   const deletedOrderItem = await this.orderItemsRepository.delete({
  //     id: In(ids),
  //   })

  //   if (!deletedOrderItem.affected)
  //     throw new InternalServerErrorException('Failed to delete order item')

  //   await this.updateOrderItems(orderId)

  //   return CreateHTTPResponseDto.noContent()
  // }

  // private async updateOrderItems(orderId: number) {
  //   const orderEntity = await this.orderRepository.findOne({
  //     where: { id: orderId },
  //     relations: ['orderItems'],
  //   })

  //   if (!orderEntity)
  //     throw new InternalServerErrorException('Failed to update order')

  //   const totalItems = orderEntity.orderItems?.length
  //   let totalPriceAmount = 0

  //   orderEntity.orderItems?.map(({ basePriceAtOrder, quantityRequested }) => {
  //     totalPriceAmount = totalPriceAmount + basePriceAtOrder * quantityRequested
  //   })

  //   const updatedOrderEntity = this.orderRepository.create({
  //     totalItems,
  //     totalPriceAmount,
  //   })
  //   return this.orderRepository.update(
  //     { id: orderEntity.id },
  //     updatedOrderEntity
  //   )
  // }

  // private async checkOrderItemExists(orderId: number, orderItemIds: number[]) {
  //   const orderEntity = await this.orderRepository.findOne({
  //     where: { id: orderId },
  //     relations: ['orderItems'],
  //   })

  //   if (!orderEntity) throw new NotFoundException('Order not found')

  //   const { status: orderStatus } = orderEntity
  //   if (orderStatus !== OrderStatus.OPEN)
  //     throw new BadRequestException('Only draft orders can be modified')

  //   const { orderItems } = orderEntity

  //   if (!orderItems)
  //     throw new BadRequestException('Theres no items in the order to update')

  //   const existingItems = orderItemIds.filter((currentItemId) => {
  //     return orderItems.some(
  //       (existingItems) => currentItemId === existingItems.id
  //     )
  //   })

  //   return existingItems
  // }

  private async processOrder(
    opts: ProcessOrderOptions
  ): Promise<CreateHTTPResponseDto> {
    const {
      emailFunction,
      expectedStatus,
      isOwnerAuthRequired,
      nextStatus,
      notifyToOwner,
      orderId,
      userEntity,
    } = opts

    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['branch', 'user'],
    })
    if (!orderEntity) throw new NotFoundException('Order not found')

    const { status: orderStatus, totalPriceAmount } = orderEntity

    if (orderStatus !== expectedStatus)
      throw new BadRequestException('This action cannot be performed')

    if (orderStatus === OrderStatus.OPEN) {
      const { startDate, endDate } = this.calculateWeeklyRange()
      const { availableWeeklyBudget } = await this.calculateWeeklyBudget(
        startDate,
        endDate
      )

      if (availableWeeklyBudget - totalPriceAmount <= 0)
        throw new BadRequestException('Weekly budget limit reached')
    }

    let isAuthorized: boolean = false
    const { role: userRole } = userEntity

    if (isOwnerAuthRequired) {
      isAuthorized =
        userEntity.id === orderEntity.user.id || userRole === Roles.ADMIN
    } else {
      isAuthorized =
        userRole === Roles.WAREHOUSE_MANAGER || userRole === Roles.ADMIN
    }

    if (!isAuthorized)
      throw new ForbiddenException(ErrorMessages.ForbiddenException)

    let userEntities: User[] = [orderEntity.user]
    if (!notifyToOwner) {
      userEntities = await this.userRepository.find({
        where: { role: Roles.WAREHOUSE_MANAGER },
      })
    }

    const response = await this.updateOrderStatus(orderId, nextStatus)

    // Notify users
    emailFunction(this.emailService, orderEntity, userEntities)

    return response
  }

  private async updateOrderStatus(
    orderId: number,
    orderStatus: OrderStatus
  ): Promise<CreateHTTPResponseDto> {
    let completedAt
    if (
      orderStatus === OrderStatus.CANCELLED ||
      orderStatus === OrderStatus.COMPLETED
    )
      completedAt = new Date()

    const updatedOrder = await this.orderRepository.update(
      { id: orderId },
      { status: orderStatus, completedAt }
    )

    if (!updatedOrder.affected)
      throw new InternalServerErrorException('Error updating order')

    return CreateHTTPResponseDto.ok('Order status updated', { orderStatus })
  }

  private generateFolio() {
    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const randomDigits = Math.floor(10 + Math.random() * 90)
    const folio = `F${randomDigits}-${month}${day}`
    return folio
  }

  private calculateWeeklyRange(selectedDate?: Date) {
    let date: Date = selectedDate ?? new Date()

    const first = date.getDate() - date.getDay() - 1

    const startDate = new Date(date.setDate(first))
    const endDate = new Date(date.setDate(date.getDate() + 6))

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }
  }

  private async calculateWeeklyBudget(startDate: string, endDate: string) {
    const orders = await this.orderRepository.find({
      where: {
        createdAt: Between(new Date(startDate), new Date(endDate)),
        status:
          OrderStatus.SENT ||
          OrderStatus.PROCESSING ||
          OrderStatus.DELIVERED ||
          OrderStatus.COMPLETED ||
          OrderStatus.CANCEL_REQUESTED,
      },
    })

    let usedWeeklyBudget = 0

    orders.forEach(({ totalPriceAmount }) => {
      usedWeeklyBudget += Number(totalPriceAmount)
    })
    const availableWeeklyBudget = this.WEEKLY_BUDGET - usedWeeklyBudget

    return {
      usedWeeklyBudget,
      availableWeeklyBudget,
      weeklyBudget: this.WEEKLY_BUDGET,
      startDate,
      endDate,
    }
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
          where[key] = Between(new Date(gte), new Date(lte))
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
