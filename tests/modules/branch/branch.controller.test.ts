import request from 'supertest'
import { Repository } from 'typeorm'

import { Branch } from '@modules/branch/models'
import { testServer } from '../../../tests/build-server'
import { AppDataSource } from '@core/datasources'
import { CreateBranchDto } from '@modules/branch/dtos'
import { User } from '@modules/user/models'
import { JWT } from '@config/plugins'
import { Role } from '@/config/roles'

describe('branch.controller.test.ts', () => {
  const jwtPlugin = JWT.instance()

  let branchRepository: Repository<Branch>
  let userRepository: Repository<User>

  let token: string

  const clearRepositoryTables = async () => {
    await branchRepository.delete({})
    await userRepository.delete({})
  }

  beforeAll(async () => {
    await testServer.start()
    await AppDataSource.initialize()

    branchRepository = AppDataSource.getRepository(Branch)
    userRepository = AppDataSource.getRepository(User)

    await clearRepositoryTables()

    const registerUserDto = {
      contactPhone: '+522742458721',
      email: 'HobwatiSxJUzHx9Lh6NQ5@gmail.com',
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

  //POST '/api/v1/branches/'
  it('should create a new branch', async () => {
    const branchDto: CreateBranchDto = {
      cityName: 'city name',
      contactEmail: 'u_l9dynd_adlbdeu-tveu@example.com',
      contactPhone: '+523456782390',
      dependantLocality: 'dependant locality',
      name: 'lkiiu8zghzsq-63uf47v1',
      postalCode: '12345',
      streetName: 'street name',
    }

    await request(testServer.app)
      .post('/api/v1/branches/')
      .set('Authorization', `Bearer ${token}`)
      .send(branchDto)
      .expect(201)
  })

  //GET '/api/v1/branches/'
  it('should get all branches', async () => {
    const branches = [
      { name: 'mt4tblucg_aqw0qv7xlxg' },
      { name: 'nauinrumzkfrohhhlpm3r' },
      { name: '3rhf2joj7lwvup3-pjobh' },
    ]
    branches.map(async (branch) => {
      const branchEntity = branchRepository.create(branch)
      await branchRepository.save(branchEntity)
    })

    await request(testServer.app)
      .get('/api/v1/branches')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //GET '/api/v1/branches/:branchId'
  it('should get a single branch by id', async () => {
    const branch = { name: 'tkh2omgnnq-5yockvju3n' }
    const branchEntity = branchRepository.create(branch)
    await branchRepository.save(branchEntity)

    await request(testServer.app)
      .get(`/api/v1/branches/${branchEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //GET '/api/v1/branches/:branchName'
  it('should get a single branch by name', async () => {
    const branch = { name: 'rc2qkmqx0ocpc1vsv1plc' }
    const branchEntity = branchRepository.create(branch)
    await branchRepository.save(branchEntity)

    await request(testServer.app)
      .get(`/api/v1/branches/${branch.name}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //PUT '/api/v1/branches/:branchId'
  it('should update a branch by id', async () => {
    const branch = { name: '_xhrpfnkpicsn6wfslbdf' }
    const branchEntity = branchRepository.create(branch)
    await branchRepository.save(branchEntity)

    await request(testServer.app)
      .put(`/api/v1/branches/${branchEntity.id}`)
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

  //DELETE '/api/v1/branches/:branchId'
  it('should delete a branch by id', async () => {
    const branch = { name: 'jfsacu8mue5ztm56gxi8mf' }
    const branchEntity = branchRepository.create(branch)
    await branchRepository.save(branchEntity)

    await request(testServer.app)
      .delete(`/api/v1/branches/${branchEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })
})
