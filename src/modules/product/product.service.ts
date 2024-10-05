import { Repository } from 'typeorm'

import { Product } from '@modules/product/models'
import {
  CreateProductDto,
  RelationsProductDto,
  UpdateProductDto,
} from '@modules/product/dtos'
import {
  CreateHTTPResponseDto,
  CreatePaginationDto,
  CreateSortingDto,
} from '@modules/shared/dtos'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'
import { Category } from '@modules/category/models'
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@core/errors'
import { Provider } from '@modules/provider/models'
import { UUID } from '@config/plugins'

export class ProductService {
  constructor(
    private readonly productRepository: Repository<Product>,
    private readonly providerRepository: Repository<Provider>,
    private readonly categoryRepository: Repository<Category>
  ) {}

  public async createProduct(
    createProductDto: CreateProductDto
  ): Promise<CreateHTTPResponseDto> {
    const { categoryId, ...product } = createProductDto
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, isActive: true },
    })

    if (!category) throw new BadRequestException('Provided category not found')

    const productEntity = this.productRepository.create({
      ...product,
      category,
    })
    await this.productRepository.save(productEntity)

    const products = this.plainProducts([productEntity])
    return CreateHTTPResponseDto.created('Product created successfully', {
      products,
    })
  }

  public async getAllProducts(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const { orderBy, sortBy = 'id' } = sortingDto
    const [products, totalItems] = await this.productRepository.findAndCount({
      take: limit,
      skip,
      where: { isActive: true },
      order: { [sortBy]: orderBy },
    })

    const pagination = CalculatePaginationUseCase.execute({
      currentPage,
      limit,
      totalItems,
    })

    return CreateHTTPResponseDto.ok(undefined, {
      products,
      pagination,
    })
  }

  public async getProductByTerm(
    term: string,
    relationsDto: RelationsProductDto
  ): Promise<CreateHTTPResponseDto> {
    let productEntity
    if (Number(term)) {
      productEntity = await this.productRepository.findOne({
        where: { id: +term, isActive: true },
        relations: [...relationsDto.include],
      })
    } else {
      productEntity = await this.productRepository.findOne({
        where: { name: term.toLowerCase(), isActive: true },
        relations: [...relationsDto.include],
      })
    }

    if (!productEntity) throw new NotFoundException('Product not found')
    return CreateHTTPResponseDto.ok(undefined, { products: [productEntity] })
  }

  public async updateProduct(
    productId: number,
    updateProductDto: UpdateProductDto
  ): Promise<CreateHTTPResponseDto> {
    const { categoryId, ...product } = updateProductDto

    let category
    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: categoryId, isActive: true },
      })
      if (!category)
        throw new BadRequestException('Provided category not found')
    }

    const productEntity = this.productRepository.create({
      ...product,
      category,
    })
    const updatedProduct = await this.productRepository.update(
      { id: productId, isActive: true },
      productEntity
    )

    if (!updatedProduct.affected)
      throw new NotFoundException('Product not found')

    return CreateHTTPResponseDto.ok('Product updated successfully')
  }

  public async deleteProduct(
    productId: number
  ): Promise<CreateHTTPResponseDto> {
    const productEntity = await this.productRepository.findOne({
      where: { id: productId, isActive: true },
    })

    if (!productEntity) throw new NotFoundException('Product not found')
    const name = productEntity.name + '_' + UUID.nanoid()
    const deleteProduct = await this.productRepository.update(
      { id: productId },
      { isActive: false, name }
    )

    if (!deleteProduct.affected)
      throw new InternalServerErrorException('Error deleting product')

    return CreateHTTPResponseDto.noContent()
  }

  private plainProducts(productList: Product[]) {
    return productList.map(({ category, ...product }) => ({
      ...product,
      category: category.name,
    }))
  }
}
