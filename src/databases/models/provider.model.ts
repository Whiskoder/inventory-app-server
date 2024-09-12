import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import {
  Category,
  Equipment,
  OrderItem,
  Product,
  ProductPrice,
  Invoice,
} from '@db/models'

@Entity({ name: 'providers' })
export class Provider {
  @ManyToMany(() => Category, (category) => category.providers)
  @JoinTable({ name: 'providers_categories' })
  categories!: Category[]

  @Column('text', { nullable: true })
  description?: string

  @Column('text', { nullable: true, unique: true })
  emailAddress?: string

  @ManyToMany(() => Equipment, (equipment) => equipment.providers, {
    nullable: true,
  })
  equipments?: Equipment[]

  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(() => Invoice, (invoice) => invoice.provider, { nullable: true })
  invoices?: Invoice[]

  @Column('text')
  name!: string

  @OneToMany(() => OrderItem, (orderItem) => orderItem.provider, {
    nullable: true,
  })
  orderItems?: OrderItem[]

  @Column('numeric', { nullable: true })
  phone?: number

  @OneToMany(() => ProductPrice, (productPrice) => productPrice.provider, {
    nullable: true,
  })
  productPrices?: ProductPrice[]

  @ManyToMany(() => Product, (product) => product.providers, { nullable: true })
  products?: Product[]

  @Column('text')
  rfc!: string
}
