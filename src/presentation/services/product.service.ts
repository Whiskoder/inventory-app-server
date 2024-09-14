import { Repository } from 'typeorm'
import { Product } from '@db/models'

export class ProductService {
  constructor(private readonly productRepository: Repository<Product>) {}
}
