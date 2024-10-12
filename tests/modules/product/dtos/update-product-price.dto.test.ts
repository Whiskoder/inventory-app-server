import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { UpdateProductPriceDto } from '@modules/product/dtos'

describe('update-product.dto.test.ts', () => {
  it('should return a UpdateProductPriceDto', async () => {
    const dto: UpdateProductPriceDto = {
      basePrice: 10,
      quantity: 10,
    }
    const updateProductPriceDto = await UpdateProductPriceDto.create(dto)
    expect(updateProductPriceDto).toBeInstanceOf(UpdateProductPriceDto)
    expect(updateProductPriceDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto = {
      basePrice: -1,
      quantity: -1,
    }
    const updateProductPriceDto = plainToInstance(UpdateProductPriceDto, dto)
    const errors = await validate(updateProductPriceDto)
    expect(errors.length).not.toBe(0)
  })
})
