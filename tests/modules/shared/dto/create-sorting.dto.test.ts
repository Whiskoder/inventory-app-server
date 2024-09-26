import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { CreateSortingDto } from '@modules/shared/dtos'

describe('create-sorting.dto.test.ts', () => {
  it('should return a CreateSortingDto', async () => {
    const dto = {
      sortBy: 'name',
      orderBy: 'asc',
    }
    const createSortingDto = await CreateSortingDto.create(dto)
    expect(createSortingDto).toBeInstanceOf(CreateSortingDto)
    expect(createSortingDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto = {
      orderBy: 'invalid',
    }
    const createSortingDto = plainToInstance(CreateSortingDto, dto)
    const errors = await validate(createSortingDto)
    expect(errors.length).toBeGreaterThan(0)
  })
})
