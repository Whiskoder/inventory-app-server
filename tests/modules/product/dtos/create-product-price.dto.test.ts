import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { CreateProductPriceDto } from '@modules/product/dtos'

describe('create-product.dto.test.ts', () => {
  it('should return a createProductPriceDto', async () => {
    const dto: CreateProductPriceDto = {
      basePrice: 10,
      quantity: 10,
      providerId: 1,
    }
    const createProductPriceDto = await CreateProductPriceDto.create(dto)
    expect(createProductPriceDto).toBeInstanceOf(CreateProductPriceDto)
    expect(createProductPriceDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto = {
      basePrice: -1,
      quantity: -1,
      providerId: 0,
    }
    const createProductPriceDto = plainToInstance(CreateProductPriceDto, dto)
    const errors = await validate(createProductPriceDto)
    expect(errors.length).not.toBe(0)
  })
})
