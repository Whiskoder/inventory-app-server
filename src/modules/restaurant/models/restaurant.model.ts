import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Order } from '@modules/order/models'

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: true })
  location?: string

  @Column('text', { unique: true })
  name!: string

  @OneToMany(() => Order, (order) => order.restaurant, { nullable: true })
  orders?: Order[]

  @Column('boolean', { default: true, select: false })
  isActive!: boolean

  normalizeStrings() {
    this.name = this.name.toLowerCase().trim()
    this.location = this.location?.toLocaleLowerCase().trim()
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
