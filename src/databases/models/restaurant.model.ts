import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from '@db/models'

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: true })
  location?: string

  @Column('text')
  name!: string

  @OneToMany(() => Order, (order) => order.restaurant, { nullable: true })
  orders?: Order[]
}
