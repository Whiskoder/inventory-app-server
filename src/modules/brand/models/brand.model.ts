import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { longNameLength } from '@/modules/shared/constants'
import { Product } from '@/modules/product/models'

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'varchar',
    length: longNameLength,
    nullable: true,
    unique: true,
  })
  name!: string

  @Column('boolean', { default: true, select: false })
  isActive!: boolean

  @OneToMany(() => Product, (product) => product.brand, { eager: false })
  products?: Product[]

  normalizeStrings() {
    this.name = this.name.toLowerCase().trim()
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
