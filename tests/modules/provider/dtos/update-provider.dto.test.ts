import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { UpdateProviderDto } from '@modules/provider/dtos'

describe('update-provider.dto.test.ts', () => {
  it('should return a UpdateProviderDto', async () => {
    const dto: UpdateProviderDto = {
      cityName: 'City Name',
      contactEmail: 'opZes_l9ZPUw32JEca5eG@example.com',
      contactPhone: '+523456782390',
      dependantLocality: 'Dependant Locality',
      description: 'Provider Description',
      name: 'Provider Name',
      postalCode: '12345',
      rfc: 'GMA090313LU7',
      streetName: 'Street Name',
    }
    const updateProviderDto = await UpdateProviderDto.create(dto)
    expect(updateProviderDto).toBeInstanceOf(UpdateProviderDto)
    expect(updateProviderDto).toEqual(dto)
  })

  it('should throw an error if the input is not valid', async () => {
    const dto = {
      cityName: '',
      contactEmail: 'wrong@example',
      contactPhone: '+1234567890',
      dependantLocality: '',
      description: '',
      name: '',
      postalCode: '123456',
      rfc: 'gma090313lu7',
      streetName: '',
    }
    const updateProviderDto = plainToInstance(UpdateProviderDto, dto)
    const errors = await validate(updateProviderDto)
    expect(errors.length).not.toBe(0)
  })
})
