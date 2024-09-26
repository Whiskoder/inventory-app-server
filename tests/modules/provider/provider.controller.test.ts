import request from 'supertest'
import { Repository } from 'typeorm'

import { testServer } from '../../../tests/build-server'
import { AppDataSource } from '@core/datasources'
import { User } from '@modules/user/models'
import { JWT } from '@config/plugins'
import { Role } from '@config/roles'
import { Provider } from '@modules/provider/models'
import { CreateProviderDto } from '@/modules/provider/dtos'

describe('provider.controller.test.ts', () => {
  const jwtPlugin = JWT.instance()

  let providerRepository: Repository<Provider>
  let userRepository: Repository<User>

  let token: string

  const clearRepositoryTables = async () => {
    await providerRepository.delete({})
    await userRepository.delete({})
  }

  beforeAll(async () => {
    await testServer.start()
    await AppDataSource.initialize()

    providerRepository = AppDataSource.getRepository(Provider)
    userRepository = AppDataSource.getRepository(User)

    await clearRepositoryTables()

    const registerUserDto = {
      contactPhone: '+522742458721',
      email: 'KAC4ZD1ZBm_3rIgJMbSmb@gmail.com',
      firstName: 'Juan',
      lastName: 'Gonzales Hernandez',
      password: '123456Ab@',
      role: Role.ADMIN,
    }

    const userEntity = userRepository.create(registerUserDto)
    await userRepository.save(userEntity)
    const id = userEntity.id
    token = await jwtPlugin.generateToken({ payload: { id } })
  })

  afterAll(async () => {
    await clearRepositoryTables()
    await testServer.close()
    await AppDataSource.destroy()
  })

  //POST '/api/v1/providers/'
  it('should create a new branch', async () => {
    const providerDto: CreateProviderDto = {
      cityName: 'city name',
      contactEmail: '01xejjslf3nc0xchmdhzf@example.com',
      contactPhone: '+523456782390',
      dependantLocality: 'dependant locality',
      name: 'ghwb010szg5ejy2xdmeyn',
      postalCode: '12345',
      rfc: 'AAA090313LU7',
      streetName: 'street name',
    }

    await request(testServer.app)
      .post('/api/v1/providers/')
      .set('Authorization', `Bearer ${token}`)
      .send(providerDto)
      .expect(201)
  })

  //GET '/api/v1/providers/'
  it('should get all branches', async () => {
    const providers = [
      { rfc: 'AAB090313LU7', name: 't-wpr2htem2dp9mmqcjew' },
      { rfc: 'AAC90313LU7', name: '5hqtpszl7mf0c0pkmkmna' },
      { rfc: 'AAD090313LU7', name: 'mygsrgass4nl14rm7m5m0' },
    ]
    providers.map(async (provider) => {
      const providerEntity = providerRepository.create(provider)
      await providerRepository.save(providerEntity)
    })

    await request(testServer.app)
      .get('/api/v1/providers')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //GET '/api/v1/providers/:providerId'
  it('should get a single branch by id', async () => {
    const provider = { rfc: 'AAE90313LU7', name: 'tkh2omgnnq-5yockvju3n' }
    const providerEntity = providerRepository.create(provider)
    await providerRepository.save(providerEntity)

    await request(testServer.app)
      .get(`/api/v1/providers/${providerEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //GET '/api/v1/providers/:providerName'
  it('should get a single branch by name', async () => {
    const provider = { rfc: 'AAF090313LU7', name: 'rc2qkmqx0ocpc1vsv1plc' }
    const providerEntity = providerRepository.create(provider)
    await providerRepository.save(providerEntity)

    await request(testServer.app)
      .get(`/api/v1/providers/${provider.name}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //PUT '/api/v1/providers/:providerId'
  it('should update a branch by id', async () => {
    const provider = { rfc: 'AAAG090313LU7', name: '_xhrpfnkpicsn6wfslbdf' }
    const providerEntity = providerRepository.create(provider)
    await providerRepository.save(providerEntity)

    await request(testServer.app)
      .put(`/api/v1/providers/${providerEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        cityName: 'city name',
        contactEmail: 'u_l9dynd_adlbdeu-tveu@example.com',
        contactPhone: '+523456782390',
        dependantLocality: 'dependant locality',
        name: 'vz3nzzo-qau_4xc6hq_oh',
        postalCode: '12345',
        streetName: 'street name',
      })
      .expect(200)
  })

  //DELETE '/api/v1/providers/:providerId'
  it('should delete a provider by id', async () => {
    const provider = { rfc: 'AAH090313LU7', name: 'jfsacu8mue5ztm56gxi8mf' }
    const providerEntity = providerRepository.create(provider)
    await providerRepository.save(providerEntity)

    await request(testServer.app)
      .delete(`/api/v1/providers/${providerEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })
})
