import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { CreateBranchDto } from '@modules/branch/dtos'

describe('create-branch.dto.test.ts', () => {
  it('should return a CreateBranchDto', async () => {
    const dto: CreateBranchDto = {
      cityName: 'City Name',
      contactEmail: 'U_L9dyND_adlBDeU-TVeu@example.com',
      contactPhone: '+523456782390',
      dependantLocality: 'Dependant Locality',
      name: 'Branch Name',
      postalCode: '12345',
      streetName: 'Street Name',
    }
    const createBranchDto = await CreateBranchDto.create(dto)
    expect(createBranchDto).toBeInstanceOf(CreateBranchDto)
    expect(createBranchDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto: CreateBranchDto = {
      cityName: '',
      contactEmail: 'wrong@example',
      contactPhone: '+1234567890',
      dependantLocality: '',
      name: '',
      postalCode: '123456',
      streetName: '',
    }
    const createBranchDto = plainToInstance(CreateBranchDto, dto)
    const errors = await validate(createBranchDto)
    expect(errors.length).not.toBe(0)
  })
})
