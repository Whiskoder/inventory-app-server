import { Equal, Like, Repository } from 'typeorm'

import { Provider } from '@modules/provider/models'
import {
  CreateProviderDto,
  FilterProviderDto,
  RelationsProviderDto,
  UpdateProviderDto,
} from '@modules/provider/dtos'
import {
  CreateHTTPResponseDto,
  CreatePaginationDto,
  CreateSortingDto,
} from '@modules/shared/dtos'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'
import { InternalServerErrorException, NotFoundException } from '@core/errors'
import { UUID } from '@config/plugins'

export class ProviderService {
  constructor(private readonly providerRepository: Repository<Provider>) {}

  public async createProvider(
    createProviderDto: CreateProviderDto
  ): Promise<CreateHTTPResponseDto> {
    const providerEntity = this.providerRepository.create(createProviderDto)
    await this.providerRepository.save(providerEntity)
    return CreateHTTPResponseDto.created('Product created successfully', {
      providers: [providerEntity],
    })
  }

  public async getProviderById(
    providerId: number,
    relationsDto: RelationsProviderDto
  ): Promise<CreateHTTPResponseDto> {
    const providerEntity = await this.providerRepository.findOne({
      where: { id: providerId, isActive: true },
      relations: [...relationsDto.include],
    })

    if (!providerEntity) throw new NotFoundException('Provider not found')
    return CreateHTTPResponseDto.ok(undefined, { providers: [providerEntity] })
  }

  public async getProviderList(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto,
    relationsDto: RelationsProviderDto,
    filterDto: FilterProviderDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip } = paginationDto
    const { orderBy, sortBy } = sortingDto

    const [providers, totalItems] = await this.providerRepository.findAndCount({
      take: limit,
      skip,
      where: this.createFilter(filterDto),
      relations: [...relationsDto.include],
      order: { [sortBy]: orderBy },
    })

    const pagination = CalculatePaginationUseCase({
      skip,
      limit,
      totalItems,
    })

    if (providers.length === 0)
      throw new NotFoundException('Providers not found')

    return CreateHTTPResponseDto.ok(undefined, { providers, pagination })
  }

  public async updateProvider(
    providerId: number,
    updateProviderDto: UpdateProviderDto
  ): Promise<CreateHTTPResponseDto> {
    const providerEntity = this.providerRepository.create(updateProviderDto)
    const updateProduct = await this.providerRepository.update(
      { id: providerId, isActive: true },
      providerEntity
    )

    if (!updateProduct.affected)
      throw new NotFoundException('Provider not found')

    return CreateHTTPResponseDto.ok('Provider updated successfully')
  }

  public async deleteProvider(
    providerId: number
  ): Promise<CreateHTTPResponseDto> {
    const providerEntity = await this.providerRepository.findOne({
      where: { id: providerId, isActive: true },
    })

    if (!providerEntity) throw new NotFoundException('Provider not found')
    const name = providerEntity.name + '_' + UUID.nanoid()
    const deletedProvider = await this.providerRepository.update(
      { id: providerId },
      { isActive: false, name }
    )

    if (!deletedProvider.affected)
      throw new InternalServerErrorException('Error deleting provider')

    return CreateHTTPResponseDto.noContent()
  }

  private createFilter(filterDto: FilterProviderDto) {
    const where: { [key: string]: any } = {
      isActive: true,
    }

    const {
      equalsCityName,
      equalsContactEmail,
      equalsContactPhone,
      equalsDependantLocality,
      equalsName,
      equalsPostalCode,
      equalsStreetName,
      equalsRfc,
      likeCityName,
      likeContactEmail,
      likeContactPhone,
      likeDependantLocality,
      likeName,
      likeStreetName,
    } = filterDto

    if (likeCityName) where.cityName = Like(`${likeCityName}`)
    if (equalsCityName) where.cityName = Equal(equalsCityName)

    if (likeContactEmail) where.contactEmail = Like(`${likeContactEmail}`)
    if (equalsContactEmail) where.contactEmail = Equal(equalsContactEmail)

    if (likeContactPhone) where.contactPhone = Like(`${likeContactPhone}`)
    if (equalsContactPhone) where.contactPhone = Equal(equalsContactPhone)

    if (likeDependantLocality)
      where.dependantLocality = Like(`${likeDependantLocality}`)
    if (equalsDependantLocality)
      where.dependantLocality = Equal(equalsDependantLocality)

    if (likeName) where.name = Like(`${likeName}`)
    if (equalsName) where.name = Equal(equalsName)

    if (likeStreetName) where.streetName = Like(`${likeStreetName}`)
    if (equalsStreetName) where.streetName = Equal(equalsStreetName)

    if (equalsPostalCode) where.postalCode = Equal(equalsPostalCode)
    if (equalsRfc) where.rfc = Equal(equalsRfc)

    return where
  }
}
