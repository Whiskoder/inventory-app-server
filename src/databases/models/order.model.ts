import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { OrderItem, User, Invoice, Restaurant } from '@db/models'

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
  orderItems!: OrderItem[]

  @Column('text')
  orderStatus!: string

  @Column('text', { nullable: true })
  requestNotes?: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders)
  @JoinColumn()
  restaurant!: Restaurant

  @Column('integer')
  totalItems!: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user!: User

  @Column('text')
  warehouseNotes?: string
}
