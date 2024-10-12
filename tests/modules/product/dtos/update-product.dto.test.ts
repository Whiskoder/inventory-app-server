import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { UpdateProductDto } from '@modules/product/dtos'
import { MeasureUnit } from '@/modules/product/enums'

describe('update-product.dto.test.ts', () => {
  it('should return a updateProductDto', async () => {
    const dto: UpdateProductDto = {
      measurementUnit: MeasureUnit.boxes,
      name: 'Product Name',
      categoryId: 1,
    }
    const updateProductDto = await UpdateProductDto.create(dto)
    expect(updateProductDto).toBeInstanceOf(UpdateProductDto)
    expect(updateProductDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto = {
      measurementUnit: 'kilos',
      name: '',
      categoryId: 0,
    }
    const updateProductDto = plainToInstance(UpdateProductDto, dto)
    const errors = await validate(updateProductDto)
    expect(errors.length).not.toBe(0)
  })
})
