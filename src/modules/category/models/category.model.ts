import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm'

import { Product } from '@modules/product/models'
import { Provider } from '@modules/provider/models'

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

  @Column('boolean', { default: true, select: false })
  isActive!: boolean

  normalizeStrings() {
    this.name = this.name.trim().toLowerCase()
  }

  @BeforeInsert()
  async beforeInsert() {
    console.log('before insert')
    this.name = this.name.trim().toLowerCase()
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.normalizeStrings()
  }
}
