import request from 'supertest'
import { Repository } from 'typeorm'

import { Product, ProductPrice } from '@modules/product/models'
import { testServer } from '../../../tests/build-server'
import { AppDataSource } from '@core/datasources'
import { CreateProductDto, CreateProductPriceDto } from '@modules/product/dtos'
import { User } from '@modules/user/models'
import { JWT } from '@config/plugins'
import { Role } from '@config/roles'
import { AppIcons } from '@modules/shared/enums'
import { Category } from '@modules/category/models'
import { CreateCategoryDto } from '@modules/category/dtos'
import { MeasureUnit } from '@modules/product/enums'
import { Provider } from '@modules/provider/models'
import { CreateProviderDto } from '@modules/provider/dtos'

describe('product.controller.test.ts', () => {
  const jwtPlugin = JWT.instance()

  let providerRepository: Repository<Provider>
  let productRepository: Repository<Product>
  let productPriceRepository: Repository<ProductPrice>
  let categoryRepository: Repository<Category>
  let userRepository: Repository<User>

  let token: string
  let categoryId: number
  let productId: number
  let productEntity: Product

  const clearRepositoryTables = async () => {
    await productPriceRepository.delete({})
    await productRepository.delete({})
    await providerRepository.delete({})
    await categoryRepository.delete({})
    await userRepository.delete({})
  }

  beforeAll(async () => {
    await testServer.start()
    await AppDataSource.initialize()

    categoryRepository = AppDataSource.getRepository(Category)
    userRepository = AppDataSource.getRepository(User)
    providerRepository = AppDataSource.getRepository(Provider)
    productRepository = AppDataSource.getRepository(Product)
    productPriceRepository = AppDataSource.getRepository(ProductPrice)

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

    const createCategoryDto: CreateCategoryDto = {
      name: 'ztu3ts1ypcfwdluks5m_3',
      iconName: AppIcons.DEFAULT,
      description: 'ap6tbhh5kqli4kbjafkm-',
    }
    const categoryEntity = categoryRepository.create(createCategoryDto)
    await categoryRepository.save(categoryEntity)
    categoryId = categoryEntity.id

    const createProductDto: CreateProductDto = {
      name: 'nhsn0exndqi5sh5hwmvw9',
      measurementUnit: MeasureUnit.boxes,
      categoryId,
    }
    productEntity = productRepository.create(createProductDto)
    await productRepository.save(productEntity)
    productId = productEntity.id
  })

  afterAll(async () => {
    await clearRepositoryTables()
    await testServer.close()
    await AppDataSource.destroy()
  })

  //POST '/api/v1/products/'
  it('should create a new product', async () => {
    const productDto: CreateProductDto = {
      name: 'z9sknv79z7zjrsrdvmhfs',
      measurementUnit: MeasureUnit.boxes,
      categoryId,
    }

    await request(testServer.app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`)
      .send(productDto)
      .expect(201)
  })

  //GET '/api/v1/products/'
  it('should get all products', async () => {
    const products = [
      {
        name: 'f84nqruuxaoz_mmvfvaum',
        measurementUnit: MeasureUnit.kilograms,
        categoryId,
      },
      {
        name: 'nqmdaekigyxeu3mxxyzon',
        measurementUnit: MeasureUnit.mililiters,
        categoryId,
      },
      {
        name: '1f6wlcrcpog32nneay9qn',
        measurementUnit: MeasureUnit.grams,
        categoryId,
      },
    ]
    products.map(async (product) => {
      const productEntity = productRepository.create(product)
      await productRepository.save(productEntity)
    })

    await request(testServer.app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //GET '/api/v1/products/:productId'
  it('should get a single product by id', async () => {
    const product = {
      name: '3rnjwxhvem4rr9dhppv2h',
      measurementUnit: MeasureUnit.liters,
      categoryId,
    }
    const productEntity = productRepository.create(product)
    await productRepository.save(productEntity)

    await request(testServer.app)
      .get(`/api/v1/products/${productEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //GET '/api/v1/products/:productName'
  it('should get a single product by name', async () => {
    const product = {
      name: 'bzlnn8cbcix-s8add6v98',
      measurementUnit: MeasureUnit.ounces,
      categoryId,
    }
    const productEntity = productRepository.create(product)
    await productRepository.save(productEntity)

    await request(testServer.app)
      .get(`/api/v1/products/${product.name}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  //PUT '/api/v1/products/:productId'
  it('should update a product by id', async () => {
    const product = {
      name: 'opsxqffidyv2vt1l1dvmv',
      measurementUnit: MeasureUnit.pieces,
      categoryId,
    }
    const productEntity = productRepository.create(product)
    await productRepository.save(productEntity)

    const { body } = await request(testServer.app)
      .put(`/api/v1/products/${productEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'o3tboabbitaagufp2zrfe',
        measurementUnit: MeasureUnit.liters,
        categoryId,
      })
      .expect(200)
  })

  //DELETE '/api/v1/products/:productId'
  it('should delete a product by id', async () => {
    const product = {
      name: 'rzf2kcmxijpapug-eg2bf',
      measurementUnit: MeasureUnit.boxes,
      categoryId,
    }
    const productEntity = productRepository.create(product)
    await productRepository.save(productEntity)

    await request(testServer.app)
      .delete(`/api/v1/products/${productEntity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  //POST '/api/v1/products/:productId/prices'
  it('should create a new product price', async () => {
    const provider: CreateProviderDto = {
      name: 'g4ngmxqmtqj3a3ajdeohb',
      rfc: 'ABA090313LU7',
    }
    const providerEntity = providerRepository.create(provider)
    await providerRepository.save(providerEntity)

    const productPrice: CreateProductPriceDto = {
      basePrice: 5,
      quantity: 10,
      providerId: providerEntity.id,
    }

    await request(testServer.app)
      .post(`/api/v1/products/${productId}/prices`)
      .set('Authorization', `Bearer ${token}`)
      .send(productPrice)
      .expect(201)
  })

  // GET '/api/v1/products/:productId/prices'
  it('should get a list of product prices from product id', async () => {
    const provider: CreateProviderDto = {
      name: '-d374qfykndwtfvtlvu9k',
      rfc: 'ABB090313LU7',
    }
    const providerEntity = providerRepository.create(provider)
    await providerRepository.save(providerEntity)

    const productPrice = {
      basePrice: 5,
      quantity: 10,
      provider: providerEntity,
      product: productEntity,
    }
    const productPriceEntity = productPriceRepository.create(productPrice)
    await productPriceRepository.save(productPriceEntity)

    await request(testServer.app)
      .get(`/api/v1/products/${productId}/prices`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  // PUT '/api/v1/products/:productId/prices/:priceId'
  it('should update a product price by id', async () => {
    const provider: CreateProviderDto = {
      name: '-s6zpo0fszcxtwicyb1lub',
      rfc: 'ABC090313LU7',
    }
    const providerEntity = providerRepository.create(provider)
    await providerRepository.save(providerEntity)

    const productPrice = {
      basePrice: 5,
      quantity: 10,
      provider: providerEntity,
      product: productEntity,
    }
    const productPriceEntity = productPriceRepository.create(productPrice)
    await productPriceRepository.save(productPriceEntity)

    await request(testServer.app)
      .put(`/api/v1/products/${productId}/prices/${productPriceEntity.id}/`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        basePrice: 4,
        quantity: 8,
      })
      .expect(200)
  })

  // DELETE '/api/v1/products/:productId/prices/:priceId'
  it('should delete a product price by id', async () => {
    const provider: CreateProviderDto = {
      name: 'jpfv0krq_feptyt3t7exz',
      rfc: 'ABD090313LU7',
    }
    const providerEntity = providerRepository.create(provider)
    await providerRepository.save(providerEntity)

    const productPrice = {
      basePrice: 5,
      quantity: 10,
      provider: providerEntity,
      product: productEntity,
    }
    const productPriceEntity = productPriceRepository.create(productPrice)
    await productPriceRepository.save(productPriceEntity)

    await request(testServer.app)
      .delete(`/api/v1/products/${productId}/prices/${productPriceEntity.id}/`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })
})
