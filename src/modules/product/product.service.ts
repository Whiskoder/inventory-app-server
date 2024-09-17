import { Repository } from 'typeorm'

import { Product } from '@modules/product/models'

export class ProductService {
  constructor(private readonly productRepository: Repository<Product>) {}
}
