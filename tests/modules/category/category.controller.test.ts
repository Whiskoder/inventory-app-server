import request from 'supertest'
import { Repository } from 'typeorm'

import { Category } from '@modules/category/models'
import { testServer } from '../../../tests/build-server'
import { AppDataSource } from '@core/datasources'
import { CreateCategoryDto } from '@modules/category/dtos'
import { User } from '@modules/user/models'
import { JWT } from '@config/plugins'
import { Role } from '@/config/roles'
import { AppIcons } from '@/modules/shared/enums'

describe('category.controller.test.ts', () => {
  const jwtPlugin = JWT.instance()

  let categoryRepository: Repository<Category>
  let userRepository: Repository<User>

  let token: string

  const clearRepositoryTables = async () => {
    await categoryRepository.delete({})
    await userRepository.delete({})
  }

  beforeAll(async () => {
    await testServer.start()
    await AppDataSource.initialize()

    categoryRepository = AppDataSource.getRepository(Category)
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

  //POST '/api/v1/categories/'
  it('should create a new category', async () => {
    const categoryDto: CreateCategoryDto = {
      name: 'hu4uw_q1d9_zvo8b7ohf2',
      iconName: AppIcons.DEFAULT,
      description: 'cmobxyxk8zekbql2kw13q',
    }

    await request(testServer.app)
      .post('/api/v1/categories/')
      .set('Authorization', `Bearer ${token}`)
      .send(categoryDto)
      .expect(201)
  })

  //GET '/api/v1/categories/'
  it('should get all categories', async () => {
    const categories = [
      { name: 'yr4eunj_vknsjiwygf-kp' },
      { name: 'mgys2tglktrr-igtf4vtc' },
      { name: 'qipivm72evsqd9am_btjr' },
    ]
    categories.map(async (category) => {
      const categoryEntity = categoryRepository.create(category)
      await categoryRepository.save(categoryEntity)
    })

    await request(testServer.app)
      .get('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //GET '/api/v1/categories/:categoryId'
  it('should get a single category by id', async () => {
    const category = { name: 'axeqtrsrzsmnrsq0kfbk4' }
    const categoryEntity = categoryRepository.create(category)
    await categoryRepository.save(categoryEntity)

    await request(testServer.app)
      .get(`/api/v1/categories/${categoryEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //GET '/api/v1/categories/:categoryName'
  it('should get a single category by name', async () => {
    const category = { name: '9d01gs8cqppd1wfuwubvs' }
    const categoryEntity = categoryRepository.create(category)
    await categoryRepository.save(categoryEntity)

    await request(testServer.app)
      .get(`/api/v1/categories/${category.name}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //PUT '/api/v1/categories/:categoryId'
  it('should update a category by id', async () => {
    const category = { name: 'qcymhkbddedycmovrk-15' }
    const categoryEntity = categoryRepository.create(category)
    await categoryRepository.save(categoryEntity)

    await request(testServer.app)
      .put(`/api/v1/categories/${categoryEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'f0bssrfkf774a-h_eesre',
        iconName: AppIcons.DEFAULT,
        description: 't9zei33jvhbyashmsef38',
      })
      .expect(200)
  })

  //DELETE '/api/v1/categories/:categoryId'
  it('should delete a category by id', async () => {
    const category = { name: 'o2l7fl7c7kx-achy-puhs' }
    const categoryEntity = categoryRepository.create(category)
    await categoryRepository.save(categoryEntity)

    await request(testServer.app)
      .delete(`/api/v1/categories/${categoryEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })
})
