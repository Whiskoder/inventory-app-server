import { Repository } from 'typeorm'

import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@core/errors'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'
import { CreateOrderDto, UpdateOrderDto } from '@modules/order/dtos'
import { HTTPResponseDto, PaginationDto } from '@modules/shared/dtos'
import { Order, OrderItem } from '@modules/order/models'
import { OrderStatus } from '@modules/order/enums'
import { Restaurant } from '@modules/restaurant/models'
import { User } from '@modules/user/models'
import { Role } from '@config/roles'
import { ErrorMessages } from '@core/enums/messages'

export class OrderService {
  constructor(
    private readonly orderRepository: Repository<Order>,
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly restaurantRepository: Repository<Restaurant>
  ) {}

  public async createOrder(
    createOrderDto: CreateOrderDto,
    userEntity: User
  ): Promise<HTTPResponseDto> {
    const { restaurantId, ...order } = createOrderDto

    const restaurantEntity = await this.restaurantRepository.findOne({
      where: { id: restaurantId, isActive: true },
    })

    if (!restaurantEntity)
      throw new BadRequestException('Restaurant provided not found')

    const orderEntity = this.orderRepository.create({
      ...order,
      user: userEntity,
      restaurant: restaurantEntity,
      orderStatus: OrderStatus.DRAFT,
    })
    await this.orderRepository.save(orderEntity)

    return HTTPResponseDto.created('Order created successfully', {
      orders: [orderEntity],
    })
  }

  // TODO: Update order status to PENDING when warehouse reads the order
  public async getAllOrders(
    paginationDto: PaginationDto
  ): Promise<HTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const [orders, totalItems] = await this.orderRepository.findAndCount({
      take: limit,
      skip,
    })

    const pagination = CalculatePaginationUseCase.execute({
      currentPage,
      limit,
      totalItems,
      skip,
    })

    return HTTPResponseDto.ok(undefined, { orders, pagination })
  }

  public async getOrderById(id: number): Promise<HTTPResponseDto> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id },
    })

    if (!orderEntity) throw new NotFoundException('Order not found')

    return HTTPResponseDto.ok(undefined, { orders: [orderEntity] })
  }

  public async updateOrder(
    id: number,
    userEntity: User,
    updateOrderDto: UpdateOrderDto
  ): Promise<HTTPResponseDto> {
    const orderEntity = await this.orderRepository.findOne({ where: { id } })

    if (!orderEntity) throw new NotFoundException('Order not found')

    const { nextOrderStep, cancelOrder } = updateOrderDto

    const { orderStatus } = orderEntity

    if (cancelOrder)
      return await this.cancelOrder(userEntity.role, id, orderStatus)
    if (nextOrderStep)
      return await this.nextOrderStep(userEntity.role, id, orderStatus)

    return HTTPResponseDto.ok('Order updated successfully')
  }

  public async deleteOrder(id: number): Promise<HTTPResponseDto> {
    // TODO: Solve error if order has childs
    const orderEntity = await this.orderRepository.findOne({ where: { id } })

    if (!orderEntity) throw new NotFoundException('Order not found')

    if (orderEntity.orderStatus !== OrderStatus.DRAFT)
      throw new BadRequestException('Only draft orders can be deleted')

    const deleteOrder = await this.orderRepository.delete({ id })

    if (!deleteOrder.affected)
      throw new InternalServerErrorException('Error deleting order')

    return HTTPResponseDto.noContent()
  }

  // TODO: Create order items only if the order is in draft status
  // TODO: Only update the order items if warehouseman accepts

  private async nextOrderStep(
    userRole: Role,
    orderId: number,
    orderStatus: OrderStatus
  ) {
    const managerTurns = [OrderStatus.DRAFT, OrderStatus.DELIVERED]
    const warehousemanTurns = [OrderStatus.PENDING, OrderStatus.PROCESSING]

    if (orderStatus >= OrderStatus.COMPLETED)
      throw new BadRequestException('Order already completed')

    const isManager = userRole === Role.MANAGER || userRole === Role.ADMIN
    const isWarehouseman =
      userRole === Role.WAREHOUSEMAN || userRole === Role.ADMIN

    const isManagerTurn = isManager && managerTurns.includes(orderStatus)
    const isWarehousemanTurn =
      isWarehouseman && warehousemanTurns.includes(orderStatus)

    if (isManagerTurn || isWarehousemanTurn)
      return this.updateOrderStatus(orderId, orderStatus + 1)

    throw new ForbiddenException(
      'You do not have permission to perform this action'
    )
  }

  // An order can only be canceled if it has not been sent by the warehouse.
  // The order can only be canceled by the warehouse,
  // and the manager can only request the cancellation.
  private async cancelOrder(
    userRole: Role,
    orderId: number,
    orderStatus: OrderStatus
  ) {
    if (orderStatus >= OrderStatus.CANCELLED)
      throw new BadRequestException('Order already cancelled')

    if (orderStatus >= OrderStatus.DELIVERED)
      throw new BadRequestException('Cannot cancel an already delivered order')

    const isWarehouseman =
      userRole === Role.WAREHOUSEMAN || userRole === Role.ADMIN
    if (isWarehouseman)
      return await this.updateOrderStatus(orderId, OrderStatus.CANCELLED)

    const isManager = userRole === Role.MANAGER
    if (isManager)
      return await this.updateOrderStatus(orderId, OrderStatus.CANCEL_REQUESTED)

    throw new ForbiddenException(ErrorMessages.ForbiddenException)
  }

  private async updateOrderStatus(
    orderId: number,
    orderStatus: OrderStatus
  ): Promise<HTTPResponseDto> {
    const updateOrder = await this.orderRepository.update(
      { id: orderId },
      { orderStatus }
    )

    if (!updateOrder.affected)
      throw new InternalServerErrorException('Error updating order')

    return HTTPResponseDto.ok('Order status updated', { orderStatus })
  }
}
