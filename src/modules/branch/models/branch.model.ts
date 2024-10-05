import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Order } from '@modules/order/models'
import { User } from '@modules/user/models'
import { Product } from '@modules/product/models'
import {
  emailLength,
  longNameLength,
  phoneLength,
  postalCodeLength,
  shortNameLength,
} from '@modules/shared/constants'

@Entity({ name: 'branches' })
export class Branch {
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
    length: longNameLength,
    nullable: true,
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
    length: longNameLength,
    nullable: true,
  })
  streetName?: string

  @OneToMany(() => Order, (order) => order.branch)
  orders?: Order[]

  @OneToMany(() => User, (user) => user.branch)
  employees?: User[]

  @ManyToMany(() => Product)
  @JoinTable()
  products?: Product[]

  @Column('boolean', { default: true, select: false })
  isActive!: boolean

  normalizeStrings() {
    this.name = this.name.toLowerCase().trim()
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
