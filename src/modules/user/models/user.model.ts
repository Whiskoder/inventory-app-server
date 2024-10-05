import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm'

import { Order } from '@modules/order/models'
import { Roles } from '@modules/user/enums'
import {
  emailLength,
  longNameLength,
  passwordHashSize,
  phoneLength,
} from '@modules/shared/constants'
import { Branch } from '@modules/branch/models'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'varchar',
    length: phoneLength,
    nullable: true,
  })
  contactPhone?: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date

  @Column({
    type: 'varchar',
    length: emailLength,
    unique: true,
  })
  email!: string

  @Column({
    type: 'varchar',
    length: longNameLength,
  })
  firstName!: string

  @Column({
    type: 'varchar',
    length: longNameLength,
    nullable: true,
  })
  lastName?: string

  @Column({
    type: 'varchar',
    length: passwordHashSize,
  })
  password!: string

  @Column({
    type: 'enum',
    default: Roles.EMPLOYEE,
    enum: Roles,
  })
  role!: Roles

  // notifications: Notification

  @ManyToOne(() => Branch, (branch) => branch.employees)
  branch?: Branch

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[]

  @Column({ type: 'boolean', default: true, select: false })
  isActive!: boolean
}
