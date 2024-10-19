import {
  Equal,
  FindOperator,
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
import { Category } from '@modules/category/models'
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@core/errors'
import { UUID } from '@config/plugins'
import { Brand } from '@modules/brand/models'

export class ProductService {
  constructor(
    private readonly productRepository: Repository<Product>,
    private readonly brandRepository: Repository<Brand>,
    private readonly categoryRepository: Repository<Category>
  ) {}

  public async createProduct(
    createProductDto: CreateProductDto
  ): Promise<CreateHTTPResponseDto> {
    const { categoryId, brandId, ...product } = createProductDto

    const searchPromises = [
      this.categoryRepository.findOne({
        where: { id: categoryId, isActive: true },
      }),
      this.brandRepository.findOne({
        where: { id: brandId, isActive: true },
      }),
    ]

    const [categoryEntity, brandEntity] = await Promise.all(searchPromises)

    if (!categoryEntity)
      throw new BadRequestException('Provided category not found')

    if (!brandEntity) throw new BadRequestException('Provided brand not found')

    const productEntity = this.productRepository.create({
      ...product,
      category: categoryEntity,
      brand: brandEntity,
    })
    await this.productRepository.save(productEntity)

    // const products = this.plainProducts([productEntity])
    return CreateHTTPResponseDto.created('Product created successfully', {
      products: [productEntity],
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

    let order: any = { [sortBy]: orderBy }
    if (sortBy === 'category') order = { category: { name: orderBy } }
    if (sortBy === 'brand') order = { brand: { name: orderBy } }

    const [products, totalItems] = await this.productRepository.findAndCount({
      take: limit,
      skip,
      where: this.createFilter(filterDto),
      relations: [...relationsDto.include],
      order,
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
    const { categoryId, brandId, ...product } = updateProductDto

    let categoryEntity
    let brandEntity

    if (categoryId) {
      categoryEntity = await this.categoryRepository.findOne({
        where: { id: categoryId, isActive: true },
      })
      if (!categoryEntity)
        throw new BadRequestException('Provided category not found')
    }

    if (brandId) {
      brandEntity = await this.brandRepository.findOne({
        where: { id: brandId, isActive: true },
      })
      if (!brandEntity)
        throw new BadRequestException('Provided brand not found')
    }

    const productEntity = this.productRepository.create({
      ...product,
      category: categoryEntity,
      brand: brandEntity,
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
      equalsBrandName,
      equalsCategoryName,
      equalsMeasureUnit,
      equalsName,
      gteMinUnits,
      gtePricePerUnit,
      likeBrandName,
      likeCategoryName,
      likeName,
      lteMinUnits,
      ltePricePerUnit,
    } = filterDto

    if (likeName) where.name = Like(`${likeName}`)
    if (equalsName) where.name = Equal(equalsName)

    if (likeBrandName) where.brand = { name: Like(`${likeBrandName}`) }
    if (equalsBrandName) where.brand = { name: Equal(equalsBrandName) }

    if (likeCategoryName) where.category = { name: Like(`${likeCategoryName}`) }
    if (equalsCategoryName) where.category = { name: Equal(equalsCategoryName) }

    if (equalsMeasureUnit) where.measureUnit = Equal(equalsMeasureUnit)

    if (ltePricePerUnit) where.pricePerUnit = LessThanOrEqual(ltePricePerUnit)
    if (gtePricePerUnit) where.pricePerUnit = MoreThanOrEqual(gtePricePerUnit)

    if (lteMinUnits) where.pricePerUnit = LessThanOrEqual(lteMinUnits)
    if (gteMinUnits) where.pricePerUnit = MoreThanOrEqual(gteMinUnits)

    return where
  }
}
