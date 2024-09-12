import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm'
import { Product, Provider } from '@db/models'

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { unique: true })
  name!: string

  @OneToMany(() => Product, (product) => product.category, { nullable: true })
  products?: Product[]

  @ManyToMany(() => Provider, (provider) => provider.categories, {
    nullable: true,
  })
  providers?: Provider[]
}
