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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minUnitQuantity!: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerUnit!: number

  @ManyToOne(() => Product, (product) => product.productPrices)
  @JoinColumn()
  product!: Product

  @ManyToOne(() => Provider, (provider) => provider.productPrices)
  @JoinColumn()
  provider!: Provider
}
