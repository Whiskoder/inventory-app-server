import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { UpdateCategoryDto } from '@modules/category/dtos'
import { AppIcons } from '@modules/shared/enums'

describe('update-category.dto.test.ts', () => {
  it('should return a CreateCategoryDto', async () => {
    const dto: UpdateCategoryDto = {
      name: 'Category Name',
      iconName: AppIcons.DEFAULT,
      description: 'Category Description',
    }
    const updateCategoryDto = await UpdateCategoryDto.create(dto)
    expect(updateCategoryDto).toBeInstanceOf(UpdateCategoryDto)
    expect(updateCategoryDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto = {
      name: '',
      iconName: 'cat_icon',
      description: '',
    }
    const updateCategoryDto = plainToInstance(UpdateCategoryDto, dto)
    const errors = await validate(updateCategoryDto)
    expect(errors.length).not.toBe(0)
  })
})
