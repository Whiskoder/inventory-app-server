import { PRODUCTS, USERS } from '@/core/seed/data'
import { AppDataSource } from '@core/datasources'
import { Product } from '@modules/product/models'
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
  private readonly productRepository: Repository<Product>
  private readonly branchRepository: Repository<Branch>
  private readonly invoiceRepository: Repository<Invoice>
  private readonly orderRepository: Repository<Order>
  private readonly orderItemRepository: Repository<OrderItem>
  private readonly providerRepository: Repository<Provider>
  private readonly userRepository: Repository<User>

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product)
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
    await this.createProducts()
  }

  private async dropDatabase() {
    await this.productRepository.delete({})

    return Promise.all([
      this.userRepository.delete({}),
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

  private createProducts() {
    const productEntities = structuredClone(PRODUCTS)

    return AppDataSource.createQueryBuilder()
      .insert()
      .into(Product)
      .values(productEntities)
      .execute()
  }
}
