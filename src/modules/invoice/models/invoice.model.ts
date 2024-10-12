import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Order } from '@modules/order/models'
import { Provider } from '@modules/provider/models'
import { descriptionLength, longNameLength } from '@/modules/shared/constants'

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date

  @Column({
    type: 'varchar',
    length: longNameLength,
    nullable: true,
  })
  fileUrl?: string

  @Column({
    type: 'varchar',
    length: descriptionLength,
    nullable: true,
  })
  notes?: string

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  paymentDate?: Date

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 2,
  })
  totalAmount!: number

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt!: Date

  @ManyToOne(() => Order, (order) => order.invoices, {
    eager: false,
  })
  @JoinColumn()
  order!: Order

  @ManyToOne(() => Provider, (provider) => provider.invoices, {
    eager: false,
  })
  @JoinColumn()
  provider!: Provider

  normalizeStrings() {
    this.fileUrl = this.fileUrl?.trim().toLowerCase()
    this.notes = this.notes?.trim().toLowerCase()
  }

  @BeforeInsert()
  async beforeInsert() {
    this.normalizeStrings()
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.normalizeStrings()
  }
}
