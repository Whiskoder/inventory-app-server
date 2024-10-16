import { PRODUCTS, USERS } from '@/core/seed/data'
import { AppDataSource } from '@core/datasources'
import { Product } from '@modules/product/models'
import { Category } from '@modules/category/models'
import { Brand } from '@modules/brand/models'
import { Branch } from '@modules/branch/models'
import { Invoice } from '@modules/invoice/models'
import { Order, OrderItem } from '@modules/order/models'
import { Provider } from '@modules/provider/models'
import { User } from '@/modules/user/models'
import { Repository } from 'typeorm'
import { bcryptAdapter } from '@/config/plugins'
;(async () => {
  await AppDataSource.initialize()
  const seed = new Seed()
  await seed.execute()
})()

class Seed {
  private readonly categoryRepository: Repository<Category>
  private readonly productRepository: Repository<Product>
  private readonly brandRepository: Repository<Brand>
  private readonly branchRepository: Repository<Branch>
  private readonly invoiceRepository: Repository<Invoice>
  private readonly orderRepository: Repository<Order>
  private readonly orderItemRepository: Repository<OrderItem>
  private readonly providerRepository: Repository<Provider>
  private readonly userRepository: Repository<User>

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category)
    this.productRepository = AppDataSource.getRepository(Product)
    this.brandRepository = AppDataSource.getRepository(Brand)
    this.branchRepository = AppDataSource.getRepository(Branch)
    this.invoiceRepository = AppDataSource.getRepository(Invoice)
    this.orderRepository = AppDataSource.getRepository(Order)
    this.orderItemRepository = AppDataSource.getRepository(OrderItem)
    this.providerRepository = AppDataSource.getRepository(Provider)
    this.userRepository = AppDataSource.getRepository(User)
  }

  public async execute() {
    await this.dropDatabase()
    await this.createUsers()
    const { generatedMaps: categories } = await this.createCategories()
    const { generatedMaps: brands } = await this.createBrands()
    await this.createProducts(brands as Brand[], categories as Category[])
  }

  private async dropDatabase() {
    await this.productRepository.delete({})

    return Promise.all([
      this.userRepository.delete({}),
      this.categoryRepository.delete({}),
      this.brandRepository.delete({}),
      this.branchRepository.delete({}),
      this.invoiceRepository.delete({}),
      this.orderRepository.delete({}),
      this.orderItemRepository.delete({}),
      this.providerRepository.delete({}),
    ])
  }

  private createUsers() {
    const userEntities = USERS.map((user) => {
      const { password, ...rest } = user
      const hashedPassword = bcryptAdapter.hash(password)
      return { password: hashedPassword, ...rest }
    })

    return AppDataSource.createQueryBuilder()
      .insert()
      .into(User)
      .values(userEntities)
      .execute()
  }

  private createCategories() {
    const categories = structuredClone(PRODUCTS)
    const uniqueCategories = [
      ...new Set(categories.map((product) => product.category)),
    ]
    const categoryEntities = uniqueCategories.map((name) => {
      return { name }
    })

    return AppDataSource.createQueryBuilder()
      .insert()
      .into(Category)
      .values(categoryEntities)
      .returning('*')
      .execute()
  }

  private createBrands() {
    const brands = structuredClone(PRODUCTS)
    const uniqueBrands = [...new Set(brands.map((product) => product.brand))]
    const brandEntities = uniqueBrands.map((name) => {
      return { name }
    })

    return AppDataSource.createQueryBuilder()
      .insert()
      .into(Brand)
      .values(brandEntities)
      .returning('*')
      .execute()
  }

  private createProducts(brands: Brand[], categories: Category[]) {
    const products = structuredClone(PRODUCTS)
    const productEntities = products.map((product) => {
      const { category, brand, ...rest } = product

      const categoryEntity = categories.find((c) => c.name === category)
      const brandEntity = brands.find((b) => b.name === brand)

      return { ...rest, category: categoryEntity, brand: brandEntity }
    })

    return AppDataSource.createQueryBuilder()
      .insert()
      .into(Product)
      .values(productEntities)
      .execute()
  }
}
