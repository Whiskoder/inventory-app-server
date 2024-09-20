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

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Order, (order) => order.orderItems, {
    eager: false,
  })
  @JoinColumn()
  order!: Order

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtOrder!: number

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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quantityDelivered?: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantityOrdered!: number
}
