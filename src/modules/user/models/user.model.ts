import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

import { Order } from '@modules/order/models'
import { Role } from '@config/roles'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  firstName!: string

  @Column('text', { nullable: true })
  lastName?: string

  @Column('text', {
    unique: true,
  })
  emailAddress!: string

  @Column('numeric', { nullable: true })
  phone?: number

  @Column('text')
  password!: string

  @Column('text', { array: true, default: ['user'] })
  roles!: Role[]

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[]
}
