import { Repository } from 'typeorm'

import { Product } from '@modules/product/models'
import { CreateProductDto, UpdateProductDto } from '@modules/product/dtos'
import { HTTPResponseDto, PaginationDto } from '@modules/shared/dtos'
import { Category } from '@modules/category/models'
import { BadRequestException } from '@/core/errors'

export class ProductService {
  constructor(
    private readonly productRepository: Repository<Product>,
    private readonly categoryRepository: Repository<Category>
  ) {}

  public async createProduct(
    createProductDto: CreateProductDto
  ): Promise<HTTPResponseDto> {
    const { categoryId, ...props } = createProductDto
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, isActive: true },
    })

    if (!category) throw new BadRequestException('Category not found')

    const product = this.productRepository.create({
      ...props,
      category,
    })
    await this.productRepository.save(product)

    const products = this.plainProducts([product])
    return HTTPResponseDto.created('Product created successfully', {
      products,
    })
  }

  public async getAllProducts(
    paginationDto: PaginationDto
  ): Promise<HTTPResponseDto> {
    return HTTPResponseDto.ok(undefined, {
      products: [],
    })
  }

  public async getProductById(id: number): Promise<HTTPResponseDto> {
    return HTTPResponseDto.ok(undefined, {
      products: [],
    })
  }

  public async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<HTTPResponseDto> {
    return HTTPResponseDto.ok('Product updated successfully')
  }

  public async deleteProduct(id: number): Promise<HTTPResponseDto> {
    return HTTPResponseDto.noContent()
  }

  private plainProducts(productList: Product[]) {
    return productList.map(({ category, ...props }) => ({
      ...props,
      category: category.name,
    }))
  }
}
