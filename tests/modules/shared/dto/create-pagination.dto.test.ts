import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { CreatePaginationDto } from '@modules/shared/dtos'

describe('create-pagination.dto.test.ts', () => {
  it('should return a CreatePaginationDto', async () => {
    const dto = {
      limit: 10,
      page: 1,
    }
    const createPaginationDto = await CreatePaginationDto.create(dto)
    expect(createPaginationDto).toBeInstanceOf(CreatePaginationDto)
    expect(createPaginationDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto = {
      limit: 'abc',
      page: 'abc',
    }
    const createPaginationDto = plainToInstance(CreatePaginationDto, dto)
    const errors = await validate(createPaginationDto)
    expect(errors.length).toBeGreaterThan(0)
  })
})
