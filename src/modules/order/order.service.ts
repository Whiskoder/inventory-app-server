import { Repository } from 'typeorm'

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
import { Branch } from '@modules/branch/models'
import { User } from '@modules/user/models'
import { Roles } from '@modules/user/enums'
import { ErrorMessages } from '@modules/shared/enums/messages'

export class OrderService {
  constructor(
    private readonly orderRepository: Repository<Order>,
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly branchRepository: Repository<Branch>
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
      branch: branchEntity,
    })
    await this.orderRepository.save(orderEntity)

    return CreateHTTPResponseDto.created('Order created successfully', {
      orders: [orderEntity],
    })
  }

  // TODO: Refactor Order life cycle
  public async nextOrderStep(
    orderId: number,
    userEntity: User
  ): Promise<CreateHTTPResponseDto> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
    })
    if (!orderEntity) throw new NotFoundException('Order not found')

    const { status: orderStatus } = orderEntity
    const branchManagerTurns = [OrderStatus.OPEN, OrderStatus.DELIVERED]
    const warehouseManagerTurns = [OrderStatus.SENT, OrderStatus.PROCESSING]
    const { role: userRole } = userEntity

    if (orderStatus >= OrderStatus.COMPLETED)
      throw new BadRequestException('Order already completed')

    const isBranchManager = userRole === Roles.BRANCH_MANAGER
    const isWarehouseManager = userRole === Roles.WAREHOUSE_MANAGER
    const isAdmin = userRole === Roles.ADMIN

    const isBranchManagerTurn =
      isBranchManager && branchManagerTurns.includes(orderStatus)
    const isWarehouseManagerTurn =
      isWarehouseManager && warehouseManagerTurns.includes(orderStatus)

    if (isBranchManagerTurn || isWarehouseManagerTurn || isAdmin)
      return await this.updateOrderStatus(orderId, orderStatus + 1)

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

  public async getAllOrders(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const { orderBy, sortBy } = sortingDto
    const [orders, totalItems] = await this.orderRepository.findAndCount({
      take: limit,
      skip,
      order: { [sortBy]: orderBy },
    })

    const pagination = CalculatePaginationUseCase.execute({
      currentPage,
      limit,
      totalItems,
    })

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

  public async createOrderItem(
    createOrderItemDto: CreateOrderItemDto,
    orderId: number
  ): Promise<CreateHTTPResponseDto> {
    // const { productPriceId, quantityRequested } = createOrderItemDto
    // const searchPromises = [
    //   this.productPriceRepository.findOne({
    //     where: { id: productPriceId },
    //     relations: ['provider', 'product'],
    //   }),
    //   this.orderRepository.findOne({ where: { id: orderId } }),
    // ]
    // const [productPriceEntity, orderEntity] = await Promise.all(searchPromises)

    // if (!productPriceEntity)
    //   throw new NotFoundException('Product price not found')
    // if (!orderEntity) throw new NotFoundException('Order not found')

    // const { status: orderStatus } = orderEntity as Order
    // if (orderStatus !== OrderStatus.OPEN)
    //   throw new BadRequestException('Only draft orders can be modified')

    // const { product, provider, basePrice } = productPriceEntity as ProductPrice

    // const isAlreadyOrderItemInOrder = await this.productPriceRepository.findOne(
    //   { where: { product, provider } }
    // )
    // if (isAlreadyOrderItemInOrder)
    //   throw new BadRequestException('Product already added')

    // const { measurementUnit } = product
    // const orderItemEntity = this.orderItemsRepository.create({
    //   basePriceAtOrder: basePrice,
    //   measurementUnit,
    //   quantityRequested,
    //   order: orderEntity,
    //   product,
    //   provider,
    // })
    // await this.orderItemsRepository.save(orderItemEntity)

    return CreateHTTPResponseDto.created('Order item placed', {
      // orderItems: [orderItemEntity],
    })
  }

  public async updateOrderItem(
    updateOrderItemDto: UpdateOrderItemDto,
    orderId: number,
    orderItemId: number
  ): Promise<CreateHTTPResponseDto> {
    await this.checkOrderItemExists(orderId, orderItemId)

    const orderItemEntity = this.orderItemsRepository.create(updateOrderItemDto)
    await this.orderItemsRepository.update({ id: orderItemId }, orderItemEntity)

    return CreateHTTPResponseDto.ok('Order item updated successfully')
  }

  public async deleteOrderItem(
    orderId: number,
    orderItemId: number
  ): Promise<CreateHTTPResponseDto> {
    await this.checkOrderItemExists(orderId, orderItemId)

    const deletedOrderItem = await this.orderItemsRepository.delete({
      id: orderItemId,
    })

    if (!deletedOrderItem.affected)
      throw new InternalServerErrorException('Failed to delete order item')

    return CreateHTTPResponseDto.noContent()
  }

  private async checkOrderItemExists(orderId: number, orderItemId: number) {
    const orderItemEntity = await this.orderItemsRepository.findOne({
      where: { id: orderItemId },
      relations: ['order'],
    })

    if (!orderItemEntity) throw new NotFoundException('Order item not found')

    const isCorrectOrder = orderItemEntity.order.id === orderId
    if (!isCorrectOrder) throw new NotFoundException('Order not found')

    const { status: orderStatus } = orderItemEntity.order
    if (orderStatus !== OrderStatus.OPEN)
      throw new BadRequestException('Only draft orders can be modified')
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
}
