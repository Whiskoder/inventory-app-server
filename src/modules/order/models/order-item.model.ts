import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
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

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(2)',
    onUpdate: 'CURRENT_TIMESTAMP(2)',
  })
  updatedAt!: Date

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  basePriceAtOrder!: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total!: number

  @Column({
    type: 'enum',
    enum: MeasureUnit,
  })
  measurementUnit!: MeasureUnit

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  quantityDelivered!: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  quantityRequested!: number

  @ManyToOne(() => Order, (order) => order.orderItems, {
    eager: false,
    onDelete: 'CASCADE',
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

  private setProps() {
    this.measurementUnit = this.product.measureUnit
    this.basePriceAtOrder = this.product.unitPrice
    this.total = this.basePriceAtOrder * this.quantityRequested
  }

  @BeforeInsert()
  async beforeInsert() {
    this.setProps()
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.setProps()
  }
}
