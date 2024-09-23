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
import { longNameLength, measurementUnitLength } from '@/core/constants'

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'varchar',
    length: measurementUnitLength,
    unique: true,
  })
  measurementUnit!: string

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
    nullable: true,
  })
  orderItems?: OrderItem[]

  @OneToMany(() => ProductPrice, (productPrice) => productPrice.product, {
    eager: true,
  })
  productPrices?: ProductPrice[]

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  category!: Category

  normalizeStrings() {
    this.name = this.name.toLowerCase().trim()
    this.measurementUnit = this.measurementUnit.toLowerCase().trim()
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
