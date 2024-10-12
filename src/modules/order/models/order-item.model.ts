import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Order } from '@modules/order/models'
import { Product } from '@modules/product/models'
import { Provider } from '@modules/provider/models'
import { MeasureUnit } from '@modules/product/enums'

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 2,
  })
  basePriceAtOrder!: number

  @Column({
    type: 'enum',
    unique: true,
    enum: MeasureUnit,
  })
  measurementUnit!: MeasureUnit

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 2,
    default: 0,
  })
  quantityDelivered!: number

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 2,
  })
  quantityRequested!: number

  @ManyToOne(() => Order, (order) => order.orderItems, {
    eager: false,
  })
  @JoinColumn()
  order!: Order

  @ManyToOne(() => Product, (product) => product.orderItems, {
    eager: false,
  })
  @JoinColumn()
  product!: Product

  @ManyToOne(() => Provider, (provider) => provider.orderItems, {
    eager: false,
  })
  @JoinColumn()
  provider!: Provider
}
