import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'

import { Invoice } from '@modules/invoice/models'
import { OrderItem } from '@modules/order/models'
import { ProductPrice } from '@modules/product/models'
import {
  descriptionLength,
  emailLength,
  longNameLength,
  shortNameLength,
  rfcLength,
  phoneLength,
  postalCodeLength,
} from '@/modules/shared/constants'

@Entity({ name: 'providers' })
export class Provider {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'varchar',
    length: shortNameLength,
    nullable: true,
  })
  cityName?: string

  @Column({
    type: 'varchar',
    length: emailLength,
    nullable: true,
  })
  contactEmail?: string

  @Column({
    type: 'varchar',
    length: phoneLength,
    nullable: true,
  })
  contactPhone?: string

  @Column({
    type: 'varchar',
    length: longNameLength,
    nullable: true,
  })
  dependantLocality?: string

  @Column({
    type: 'varchar',
    length: descriptionLength,
    nullable: true,
  })
  description?: string

  @Column({
    type: 'varchar',
    length: longNameLength,
    unique: true,
  })
  name!: string

  @Column({
    type: 'varchar',
    length: postalCodeLength,
    nullable: true,
  })
  postalCode?: string

  @Column({
    type: 'varchar',
    length: rfcLength,
    unique: true,
  })
  rfc!: string

  @Column({
    type: 'varchar',
    length: longNameLength,
    nullable: true,
  })
  streetName?: string

  @Column({
    type: 'boolean',
    default: true,
    select: false,
  })
  isActive!: boolean

  @OneToMany(() => Invoice, (invoice) => invoice.provider, {
    eager: false,
  })
  invoices?: Invoice[]

  @OneToMany(() => OrderItem, (orderItem) => orderItem.provider, {
    eager: false,
  })
  orderItems?: OrderItem[]

  @OneToMany(() => ProductPrice, (productPrice) => productPrice.provider, {
    eager: false,
  })
  productPrices?: ProductPrice[]

  normalizeStrings() {
    this.name = this.name.toLowerCase().trim()
    this.description = this.description?.toLowerCase().trim()
    this.cityName = this.cityName?.toLowerCase().trim()
    this.contactEmail = this.contactEmail?.toLowerCase().trim()
    this.dependantLocality = this.dependantLocality?.toLowerCase().trim()
    this.streetName = this.streetName?.toLowerCase().trim()
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
