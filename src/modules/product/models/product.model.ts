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

@Entity({ name: 'products' })
export class Product {
  @Column('integer', { unique: true, nullable: true })
  barCode!: number

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  category!: Category

  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  measureUnit!: string

  @Column('text', { unique: true })
  name!: string

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product, {
    nullable: true,
  })
  orderItems?: OrderItem[]

  @OneToMany(() => ProductPrice, (productPrice) => productPrice.product, {
    eager: true,
  })
  productPrices?: ProductPrice[]

  // @ManyToMany(() => Provider, (provider) => provider.products)
  // @JoinTable({ name: 'products_providers' })
  // providers?: Provider[]

  @Column('decimal', { default: 0 })
  stock!: number

  @Column('boolean', { default: true, select: false })
  isActive!: boolean

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
