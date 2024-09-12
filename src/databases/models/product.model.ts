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
import { Category, Provider, ProductPrice, OrderItem } from '@db/models'

@Entity({ name: 'products' })
export class Product {
  @Column('numeric')
  barCode!: number

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category!: Category

  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  measureUnit!: string

  @Column('text')
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
