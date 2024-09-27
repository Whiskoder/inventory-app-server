import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Product } from '@modules/product/models'
import { Provider } from '@modules/provider/models'

@Entity({ name: 'product_prices' })
export class ProductPrice {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  quantity!: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  basePrice!: number

  @ManyToOne(() => Product, (product) => product.productPrices, {
    eager: false,
  })
  @JoinColumn()
  product!: Product

  @ManyToOne(() => Provider, (provider) => provider.productPrices, {
    eager: true,
  })
  @JoinColumn()
  provider!: Provider
}
