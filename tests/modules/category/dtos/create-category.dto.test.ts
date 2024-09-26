import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { CreateCategoryDto } from '@modules/category/dtos'
import { AppIcons } from '@modules/shared/enums'

describe('create-category.dto.test.ts', () => {
  it('should return a CreateCategoryDto', async () => {
    const dto: CreateCategoryDto = {
      name: 'Category Name',
      iconName: AppIcons.DEFAULT,
      description: 'Category Description',
    }
    const createCategoryDto = await CreateCategoryDto.create(dto)
    expect(createCategoryDto).toBeInstanceOf(CreateCategoryDto)
    expect(createCategoryDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto = {
      name: '',
      iconName: 'cat_icon',
      description: '',
    }
    const createCategoryDto = plainToInstance(CreateCategoryDto, dto)
    const errors = await validate(createCategoryDto)
    expect(errors.length).not.toBe(0)
  })
})
