import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm'

import { Category } from '@modules/category/models'
import { OrderItem } from '@modules/order/models'
import { ProductPrice } from '@modules/product/models'
import { Provider } from '@modules/provider/models'

@Entity({ name: 'products' })
export class Product {
  @Column('numeric', { unique: true })
  barCode!: number

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
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
    nullable: true,
  })
  productPrices?: ProductPrice[]

  @ManyToMany(() => Provider, (provider) => provider.products, {
    nullable: true,
  })
  @JoinTable({ name: 'products_providers' })
  providers?: Provider[]

  @Column('decimal', { default: 0 })
  stock!: number
}
