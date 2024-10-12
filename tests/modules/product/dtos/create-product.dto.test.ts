import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { CreateProductDto } from '@modules/product/dtos'
import { MeasureUnit } from '@/modules/product/enums'

describe('create-product.dto.test.ts', () => {
  it('should return a CreateProductDto', async () => {
    const dto: CreateProductDto = {
      measurementUnit: MeasureUnit.boxes,
      name: 'Product Name',
      categoryId: 1,
    }
    const createProductDto = await CreateProductDto.create(dto)
    expect(createProductDto).toBeInstanceOf(CreateProductDto)
    expect(createProductDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto = {
      measurementUnit: 'kilos',
      name: '',
      categoryId: 0,
    }
    const createProductDto = plainToInstance(CreateProductDto, dto)
    const errors = await validate(createProductDto)
    expect(errors.length).not.toBe(0)
  })
})
