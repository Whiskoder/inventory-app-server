import { Repository } from 'typeorm'

import { Product, ProductPrice } from '@modules/product/models'
import {
  CreateProductDto,
  CreateProductPriceDto,
  UpdateProductDto,
  UpdateProductPriceDto,
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
    private readonly productPriceRepository: Repository<ProductPrice>,
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
      skip,
    })

    return CreateHTTPResponseDto.ok(undefined, {
      products,
      pagination,
    })
  }

  public async getProductByTerm(term: string): Promise<CreateHTTPResponseDto> {
    let product
    if (Number(product)) {
      product = await this.productRepository.findOne({
        where: { id: +term, isActive: true },
      })
    } else {
      product = await this.productRepository.findOne({
        where: { name: term.toLowerCase(), isActive: true },
      })
    }

    if (!product) throw new NotFoundException('Product not found')
    return CreateHTTPResponseDto.ok(undefined, { products: [product] })
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

  public async createProductPrice(
    productId: number,
    createProductPriceDto: CreateProductPriceDto
  ): Promise<CreateHTTPResponseDto> {
    const { providerId, ...productPrice } = createProductPriceDto

    const searchPromises = [
      this.productRepository.findOne({
        where: { id: productId, isActive: true },
      }),
      this.providerRepository.findOne({
        where: { id: providerId, isActive: true },
      }),
      this.productPriceRepository.findOne({
        where: { provider: { id: providerId }, product: { id: productId } },
      }),
    ]

    const [productEntity, providerEntity, existingPrice] = await Promise.all(
      searchPromises
    )

    if (!productEntity) throw new BadRequestException('Product not found')
    if (!providerEntity) throw new BadRequestException('Provider not found')
    if (existingPrice)
      throw new BadRequestException(
        `This product already has a price associated with the provider with id ${existingPrice.id}.`
      )

    const productPriceEntity = this.productPriceRepository.create({
      ...productPrice,
      provider: providerEntity,
      product: productEntity,
    })
    await this.productPriceRepository.save(productPriceEntity)

    const productPrices = this.plainProductPrices([productPriceEntity])
    return CreateHTTPResponseDto.created('Product price created successfully', {
      productPrices,
    })
  }

  public async getProductPricesByProductId(
    productId: number,
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const { orderBy, sortBy = 'id' } = sortingDto
    const [result, totalItems] = await this.productPriceRepository.findAndCount(
      {
        take: limit,
        skip,
        where: { product: { id: productId } },
        order: { [sortBy]: orderBy },
      }
    )

    const pagination = CalculatePaginationUseCase.execute({
      currentPage,
      limit,
      totalItems,
      skip,
    })

    const productPrices = this.plainProductPrices(result)

    return CreateHTTPResponseDto.ok(undefined, {
      productPrices,
      pagination,
    })
  }

  public async updateProductPrice(
    productId: number,
    priceId: number,
    updateProductPriceDto: UpdateProductPriceDto
  ): Promise<CreateHTTPResponseDto> {
    await this.checkProductPriceExists(productId, priceId)

    const productPriceEntity = this.productPriceRepository.create(
      updateProductPriceDto
    )
    await this.productPriceRepository.update(
      { id: priceId },
      productPriceEntity
    )

    return CreateHTTPResponseDto.ok('Product price updated successfully')
  }

  public async deleteProductPrice(
    productId: number,
    priceId: number
  ): Promise<CreateHTTPResponseDto> {
    await this.checkProductPriceExists(productId, priceId)

    const deleteProductPrice = await this.productPriceRepository.delete({
      id: priceId,
    })

    if (!deleteProductPrice.affected)
      throw new InternalServerErrorException('Failed to delete product price')

    return CreateHTTPResponseDto.noContent()
  }

  private async checkProductPriceExists(productId: number, priceId: number) {
    const productEntity = await this.productRepository.findOne({
      where: { id: productId },
    })

    if (!productEntity) throw new NotFoundException('Product not found')

    const existingProductPrice = productEntity?.productPrices?.find(
      ({ id }) => id === priceId
    )
    if (!existingProductPrice)
      throw new NotFoundException('Product price not found')
  }

  private plainProductPrices(productPriceList: ProductPrice[]) {
    return productPriceList.map(({ product, provider, ...productPrice }) => ({
      ...productPrice,
      providerId: provider.id,
    }))
  }

  private plainProducts(productList: Product[]) {
    return productList.map(({ category, ...product }) => ({
      ...product,
      category: category.name,
    }))
  }
}
