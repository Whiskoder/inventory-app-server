import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  Index,
  Unique,
} from 'typeorm'

import { OrderItem } from '@modules/order/models'
import { codeLength, longNameLength } from '@modules/shared/constants'
import { MeasureUnit } from '@modules/product/enums'
import { Branch } from '@modules/branch/models'
import { Provider } from '@modules/provider/models'

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'enum',
    enum: MeasureUnit,
  })
  measureUnit!: MeasureUnit

  @Index('UQ_product_code', ['code'], { unique: true })
  @Column({
    type: 'varchar',
    length: codeLength,
    nullable: true,
  })
  code!: string

  @Column({
    type: 'varchar',
    length: longNameLength,
  })
  name!: string

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  unitPrice!: number

  @Column({
    type: 'boolean',
    default: true,
    select: false,
  })
  isActive!: boolean

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product, {
    eager: false,
  })
  orderItems?: OrderItem[]

  @Column({
    type: 'varchar',
    length: longNameLength,
    default: '',
  })
  category!: string

  @Column({
    type: 'varchar',
    length: longNameLength,
    default: '',
  })
  brand!: string

  @ManyToMany(() => Branch)
  branches?: Branch[]

  @ManyToMany(() => Provider)
  providers?: Provider[]

  normalizeStrings() {
    this.name = this.name.toLowerCase().trim()
    this.category = this.category ?? ''.toLowerCase().trim()
    this.brand = this.brand ?? ''.toLowerCase().trim()
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
