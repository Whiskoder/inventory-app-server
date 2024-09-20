import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Invoice } from '@modules/invoice/models'
import { OrderItem } from '@modules/order/models'
import { Restaurant } from '@modules/restaurant/models'
import { User } from '@modules/user/models'

@Entity()
export class Order {
  @Column('timestamptz', { nullable: true })
  completionDate?: Date

  @CreateDateColumn()
  createdAt!: Date

  @Column('timestamptz')
  deliveryDate!: Date

  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(() => Invoice, (invoice) => invoice.order, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  invoices?: Invoice[]

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  orderItems?: OrderItem[]

  @Column('integer')
  orderStatus!: number

  @Column('text', { nullable: true })
  requestNotes?: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    eager: true,
  })
  @JoinColumn()
  restaurant!: Restaurant

  @Column('integer', { default: 0 })
  totalItems!: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice!: number

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user!: User

  @Column('text', { nullable: true })
  warehouseNotes?: string
}
