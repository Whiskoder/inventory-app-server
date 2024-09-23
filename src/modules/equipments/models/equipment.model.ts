import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import { Provider } from '@modules/provider/models'

@Entity({ name: 'equipments' })
export class Equipment {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  name!: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number

  // @ManyToMany(() => Provider, (provider) => provider.equipments, {
  //   nullable: true,
  // })
  // @JoinTable({ name: 'equipments_providers' })
  // providers?: Provider[]

  @Column('decimal', { default: 0 })
  stock!: number
}
