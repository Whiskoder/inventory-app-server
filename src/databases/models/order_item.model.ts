import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Order, Product, Provider } from '@db/models'

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn()
  order!: Order

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtOrder!: number

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn()
  product!: Product

  @ManyToOne(() => Provider, (provider) => provider.orderItems)
  @JoinColumn()
  provider!: Provider

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quantityDelivered?: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantityOrdered!: number
}
