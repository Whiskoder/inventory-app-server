import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm'

import { descriptionLength, shortNameLength } from '@modules/shared/constants'
import { Product } from '@modules/product/models'
import { AppIcons } from '@modules/shared/enums'

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'varchar',
    length: shortNameLength,
    unique: true,
  })
  name!: string

  @Column({
    type: 'enum',
    default: AppIcons.DEFAULT,
    enum: AppIcons,
  })
  iconName!: AppIcons

  @Column({
    type: 'varchar',
    length: descriptionLength,
    nullable: true,
  })
  description?: string

  @Column({
    type: 'boolean',
    default: true,
    select: false,
  })
  isActive!: boolean

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[]

  normalizeStrings() {
    this.name = this.name.trim().toLowerCase()
    this.description = this.description?.trim().toLowerCase()
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
