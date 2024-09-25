import { Repository } from 'typeorm'

import { Provider } from '@modules/provider/models'
import { CreateProviderDto, UpdateProviderDto } from '@modules/provider/dtos'
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

  public async getAllProviders(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const { orderBy, sortBy = 'id' } = sortingDto
    const [providers, totalItems] = await this.providerRepository.findAndCount({
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

    return CreateHTTPResponseDto.ok(undefined, { providers, pagination })
  }

  public async getProviderByTerm(term: string): Promise<CreateHTTPResponseDto> {
    let providerEntity
    if (Number(term)) {
      providerEntity = await this.providerRepository.findOne({
        where: { id: +term, isActive: true },
      })
    } else {
      const queryBuilder = this.providerRepository.createQueryBuilder()
      providerEntity = await queryBuilder
        .where('rfc =:rfc or name =:name', {
          rfc: term.toUpperCase(),
          name: term.toLowerCase(),
        })
        .getOne()
    }

    if (!providerEntity) throw new NotFoundException('Provider not found')
    return CreateHTTPResponseDto.ok(undefined, { providers: [providerEntity] })
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
}
