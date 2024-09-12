import { categories } from '@db/seed/data'
import { AppDataSource } from '@db/datasources'
import { Category, Equipment, Product, Provider } from '@db/models'
;(async () => {
  await AppDataSource.initialize()
  await main()
})()

async function main() {
  const categoryRepository = AppDataSource.getRepository(Category)
  const productRepository = AppDataSource.getRepository(Product)
  const equipmentRepository = AppDataSource.getRepository(Equipment)
  const providerRepository = AppDataSource.getRepository(Provider)

  //!Borrar todo
  await Promise.all([
    categoryRepository.delete({}),
    productRepository.delete({}),
    equipmentRepository.delete({}),
    providerRepository.delete({}),
  ])

  // Crear categorias
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Category)
    .values(categories)
    .execute()
}
