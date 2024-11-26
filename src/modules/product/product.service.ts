import {
  Equal,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm'

import { Product } from '@modules/product/models'
import {
  CreateProductDto,
  FilterProductDto,
  RelationsProductDto,
  UpdateProductDto,
} from '@modules/product/dtos'
import {
  CreateHTTPResponseDto,
  CreatePaginationDto,
  CreateSortingDto,
} from '@modules/shared/dtos'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'
import { InternalServerErrorException, NotFoundException } from '@core/errors'
import { UUID } from '@config/plugins'

export class ProductService {
  constructor(private readonly productRepository: Repository<Product>) {}

  public async createProduct(
    createProductDto: CreateProductDto
  ): Promise<CreateHTTPResponseDto> {
    const productEntity = this.productRepository.create({
      ...createProductDto,
    })
    await this.productRepository.save(productEntity)

    return CreateHTTPResponseDto.created('Product created successfully', {
      products: [productEntity],
    })
  }

  public async createOrUpdateMultipleProducts(
    createProductDtos: CreateProductDto[]
  ): Promise<CreateHTTPResponseDto> {
    const productEntities = createProductDtos.map((product) =>
      this.productRepository.create(product)
    )

    await this.productRepository.manager
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(productEntities)
      .orUpdate(
        ['brand', 'category', 'name', 'unitPrice', 'measureUnit'],
        ['code']
      )
      .execute()

    return CreateHTTPResponseDto.ok(undefined, {
      products: [],
    })
  }

  public async getProductById(
    productId: number,
    relationsDto: RelationsProductDto
  ): Promise<CreateHTTPResponseDto> {
    const productEntity = await this.productRepository.findOne({
      where: { id: productId, isActive: true },
      relations: [...relationsDto.include],
    })

    if (!productEntity) throw new NotFoundException('Product not found')
    return CreateHTTPResponseDto.ok(undefined, { products: [productEntity] })
  }

  public async getProductList(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto,
    relationsDto: RelationsProductDto,
    filterDto: FilterProductDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip } = paginationDto
    const { orderBy, sortBy } = sortingDto

    const [products, totalItems] = await this.productRepository.findAndCount({
      take: limit,
      skip: skip,
      where: this.createFilter(filterDto),
      relations: [...relationsDto.include],
      order: { [sortBy]: orderBy },
    })

    const pagination = CalculatePaginationUseCase({
      skip,
      limit,
      totalItems,
    })

    if (products.length === 0) throw new NotFoundException('Products not found')

    return CreateHTTPResponseDto.ok(undefined, {
      products,
      pagination,
    })
  }

  public async updateProduct(
    productId: number,
    updateProductDto: UpdateProductDto
  ): Promise<CreateHTTPResponseDto> {
    const productEntity = this.productRepository.create({
      ...updateProductDto,
    })

    const updatedProduct = await this.productRepository.update(
      { id: productId, isActive: true },
      productEntity
    )

    if (!updatedProduct.affected)
      throw new NotFoundException('Product not found')

    return CreateHTTPResponseDto.ok('Product updated successfully', {
      products: [{ ...productEntity, id: productId }],
    })
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

  private createFilter(filterDto: FilterProductDto) {
    const where: { [key: string]: any } = {
      isActive: true,
    }

    const {
      equalsBrand,
      equalsCategory,
      equalsMeasureUnit,
      equalsName,
      gteUnitPrice,
      likeBrand,
      likeCategory,
      likeName,
      lteUnitPrice,
    } = filterDto

    if (likeName) where.name = Like(`${likeName}`)
    if (equalsName) where.name = Equal(equalsName)

    if (likeBrand) where.brand = { name: Like(`${likeBrand}`) }
    if (equalsBrand) where.brand = { name: Equal(equalsBrand) }

    if (likeCategory) where.category = { name: Like(`${likeCategory}`) }
    if (equalsCategory) where.category = { name: Equal(equalsCategory) }

    if (equalsMeasureUnit) where.measureUnit = Equal(equalsMeasureUnit)

    if (lteUnitPrice) where.pricePerUnit = LessThanOrEqual(lteUnitPrice)
    if (gteUnitPrice) where.pricePerUnit = MoreThanOrEqual(gteUnitPrice)

    return where
  }
}
