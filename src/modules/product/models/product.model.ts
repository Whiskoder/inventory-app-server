import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
} from 'typeorm'

import { Category } from '@modules/category/models'
import { OrderItem } from '@modules/order/models'
import { longNameLength } from '@/modules/shared/constants'
import { MeasureUnit } from '@modules/product/enums'
import { Branch } from '@modules/branch/models'
import { Brand } from '@modules/brand/models'
import { Provider } from '@/modules/provider/models'

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'enum',
    enum: MeasureUnit,
  })
  measureUnit!: MeasureUnit

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
  pricePerUnit!: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  minUnits!: number

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

  @ManyToOne(() => Category, (category) => category.products, {
    eager: false,
  })
  @JoinColumn()
  category!: Category

  @ManyToOne(() => Brand, (brand) => brand.products, { eager: false })
  @JoinColumn()
  brand!: Brand

  @ManyToMany(() => Branch)
  branches?: Branch[]

  @ManyToMany(() => Provider)
  providers?: Provider[]

  normalizeStrings() {
    this.name = this.name.toLowerCase().trim()
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
