import {
  BeforeInsert,
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
import { Branch } from '@modules/branch/models'
import { User } from '@modules/user/models'
import { descriptionLength } from '@/modules/shared/constants'
import { OrderStatus } from '@modules/order/enums'

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  folio!: string

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  completedAt?: Date

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt!: Date

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  deliveryDate!: Date

  @Column({
    type: 'varchar',
    length: descriptionLength,
    nullable: true,
  })
  notes?: string

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.OPEN,
  })
  status!: OrderStatus

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalPriceAmount!: number

  @Column({
    type: 'smallint',
    default: 0,
  })
  totalItems!: number

  @OneToMany(() => Invoice, (invoice) => invoice.order, {
    eager: false,
  })
  invoices?: Invoice[]

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    eager: false,
  })
  orderItems?: OrderItem[]

  @ManyToOne(() => Branch, (branch) => branch.orders, {
    eager: false,
  })
  @JoinColumn()
  branch!: Branch

  @ManyToOne(() => User, (user) => user.orders, {
    eager: false,
  })
  @JoinColumn()
  user!: User
}
