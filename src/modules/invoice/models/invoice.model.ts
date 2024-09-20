import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Order } from '@modules/order/models'
import { Provider } from '@modules/provider/models'

@Entity()
export class Invoice {
  @CreateDateColumn()
  createdAt!: Date

  @Column('text', { nullable: true })
  filename?: string

  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Order, (order) => order.invoices, {
    eager: false,
  })
  @JoinColumn()
  order!: Order

  @Column('timestamptz', { nullable: true })
  paymentDate?: Date

  @Column('text', { nullable: true })
  paymentMethod?: string

  @ManyToOne(() => Provider, (provider) => provider.invoices, {
    eager: false,
  })
  @JoinColumn()
  provider!: Provider

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number
}
