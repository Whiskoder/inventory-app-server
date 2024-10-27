import { Equal, Like, Repository } from 'typeorm'

import { Brand } from '@modules/brand/models'
import {
  CreateBrandDto,
  FilterBrandDto,
  RelationsBrandDto,
  UpdateBrandDto,
} from '@modules/brand/dtos'
import {
  CreateHTTPResponseDto,
  CreatePaginationDto,
  CreateSortingDto,
} from '@modules/shared/dtos'
import { InternalServerErrorException, NotFoundException } from '@core/errors'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'
import { UUID } from '@config/plugins'

export class BrandService {
  constructor(private readonly brandRepository: Repository<Brand>) {}

  public async createBrand(
    createbrandDto: CreateBrandDto
  ): Promise<CreateHTTPResponseDto> {
    const brandEntity = this.brandRepository.create(createbrandDto)
    await this.brandRepository.save(brandEntity)

    return CreateHTTPResponseDto.created('brand created succesfully', {
      brands: [brandEntity],
    })
  }

  public async getBrandById(
    brandId: number,
    relationsDto: RelationsBrandDto
  ): Promise<CreateHTTPResponseDto> {
    const brandEntity = await this.brandRepository.findOne({
      where: { id: brandId, isActive: true },
      relations: [...relationsDto.include],
    })

    if (!brandEntity) throw new NotFoundException('brand not found')
    return CreateHTTPResponseDto.ok(undefined, { brands: [brandEntity] })
  }

  public async getBrandList(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto,
    relationsDto: RelationsBrandDto,
    filterDto: FilterBrandDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip } = paginationDto
    const { orderBy, sortBy } = sortingDto

    const where: { [key: string]: any } = {
      isActive: true,
    }

    const { equalsName, likeName } = filterDto
    if (equalsName) where.name = Equal(equalsName)
    if (likeName) where.name = Like(`${likeName}`)

    const [brands, totalItems] = await this.brandRepository.findAndCount({
      take: limit,
      skip,
      where,
      relations: [...relationsDto.include],
      order: { [sortBy]: orderBy },
    })

    const pagination = CalculatePaginationUseCase({
      skip,
      limit,
      totalItems,
    })

    if (brands.length === 0) throw new NotFoundException('Brand not found')

    return CreateHTTPResponseDto.ok(undefined, {
      brands,
      pagination,
    })
  }

  public async updateBrand(
    brandId: number,
    updatebrandDto: UpdateBrandDto
  ): Promise<CreateHTTPResponseDto> {
    const brandEntity = this.brandRepository.create(updatebrandDto)
    const updatedbrand = await this.brandRepository.update(
      { isActive: true, id: brandId },
      brandEntity
    )

    if (!updatedbrand.affected) throw new NotFoundException('brand not found')

    return CreateHTTPResponseDto.ok('Brand updated successfully', {
      brands: [{ ...brandEntity, id: brandId }],
    })
  }

  public async deleteBrand(brandId: number): Promise<CreateHTTPResponseDto> {
    const brandEntity = await this.brandRepository.findOne({
      where: { id: brandId, isActive: true },
    })

    if (!brandEntity) throw new NotFoundException('brand not found')
    const name = brandEntity.name + '_' + UUID.nanoid()
    const deletedbrand = await this.brandRepository.update(
      { id: brandId },
      { isActive: false, name }
    )

    if (!deletedbrand.affected)
      throw new InternalServerErrorException('Error deleting brand')

    return CreateHTTPResponseDto.noContent()
  }
}
