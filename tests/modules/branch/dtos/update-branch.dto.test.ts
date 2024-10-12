import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import 'reflect-metadata'

import { UpdateBranchDto } from '@modules/branch/dtos'

describe('update-branch.dto.test.ts', () => {
  it('should return a CreateBranchDto', async () => {
    const dto: UpdateBranchDto = {
      cityName: 'City Name',
      contactEmail: '5BU5QYX3ffF0dEd2p9BtK@example.com',
      contactPhone: '+523456782390',
      dependantLocality: 'Dependant Locality',
      name: 'Branch Name',
      postalCode: '12345',
      streetName: 'Street Name',
    }
    const updateBranchDto = await UpdateBranchDto.create(dto)
    expect(updateBranchDto).toBeInstanceOf(UpdateBranchDto)
    expect(updateBranchDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto: UpdateBranchDto = {
      cityName: '',
      contactEmail: 'wrong@example',
      contactPhone: '+1234567890',
      dependantLocality: '',
      name: '',
      postalCode: '123456',
      streetName: '',
    }
    const updateBranchDto = plainToInstance(UpdateBranchDto, dto)
    const errors = await validate(updateBranchDto)
    expect(errors.length).not.toBe(0)
    // Every propperty should be present in the error message
    errors.forEach((err: ValidationError) => {
      expect(Object.keys(dto)).toContain(err.property)
    })
  })
})
