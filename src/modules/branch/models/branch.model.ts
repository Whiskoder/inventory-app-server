import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Order } from '@modules/order/models'
import {
  emailLength,
  longNameLength,
  phoneLength,
  postalCodeLength,
  shortNameLength,
} from '@core/constants'

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

  @OneToMany(() => Order, (order) => order.branch, { nullable: true })
  orders?: Order[]

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
