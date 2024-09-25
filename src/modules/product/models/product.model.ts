import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'

import { Category } from '@modules/category/models'
import { OrderItem } from '@modules/order/models'
import { ProductPrice } from '@modules/product/models'
import { longNameLength } from '@/modules/shared/constants'
import { MeasureUnit } from '@modules/product/enums'

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'enum',
    unique: true,
    enum: MeasureUnit,
  })
  measurementUnit!: MeasureUnit

  @Column({
    type: 'varchar',
    length: longNameLength,
    unique: true,
  })
  name!: string

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

  @OneToMany(() => ProductPrice, (productPrice) => productPrice.product, {
    eager: false,
  })
  productPrices?: ProductPrice[]

  @ManyToOne(() => Category, (category) => category.products, {
    eager: false,
  })
  @JoinColumn()
  category!: Category

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
