import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { CreateProviderDto } from '@modules/provider/dtos'

describe('create-provider.dto.test.ts', () => {
  it('should return a CreateProviderDto', async () => {
    const dto: CreateProviderDto = {
      cityName: 'City Name',
      contactEmail: '-RhXOuNsPY-mStpWk7O-O@example.com',
      contactPhone: '+523456782390',
      dependantLocality: 'Dependant Locality',
      description: 'Provider Description',
      name: 'Provider Name',
      postalCode: '12345',
      rfc: 'GMA090313LU7',
      streetName: 'Street Name',
    }
    const createProviderDto = await CreateProviderDto.create(dto)
    expect(createProviderDto).toBeInstanceOf(CreateProviderDto)
    expect(createProviderDto).toEqual(dto)
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

    const createProviderDto = plainToInstance(CreateProviderDto, dto)
    const errors = await validate(createProviderDto)
    expect(errors.length).not.toBe(0)
  })
})
