import { Repository } from 'typeorm'
import { Provider } from '@modules/provider/models'
import { CreateProviderDto, UpdateProviderDto } from '@modules/provider/dtos'
import { HTTPResponseDto, PaginationDto } from '@modules/shared/dtos'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'
import { NotFoundException } from '@/core/errors'

export class ProviderService {
  constructor(private readonly providerRepository: Repository<Provider>) {}

  public async createProvider(
    createProviderDto: CreateProviderDto
  ): Promise<HTTPResponseDto> {
    const isExistingProvider = await this.providerRepository.update(
      { name: createProviderDto.name, isActive: false },
      { isActive: true }
    )

    if (isExistingProvider.affected === 1)
      return HTTPResponseDto.accepted(
        `Provider ${createProviderDto.name} already exists`
      )

    const providerEntity = this.providerRepository.create(createProviderDto)
    await this.providerRepository.save(providerEntity)
    return HTTPResponseDto.created('Product created successfully', {
      providers: [providerEntity],
    })
  }

  public async getAllProviders(
    paginationDto: PaginationDto
  ): Promise<HTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const [providers, totalItems] = await this.providerRepository.findAndCount({
      take: limit,
      skip,
      where: { isActive: true },
    })

    const pagination = CalculatePaginationUseCase.execute({
      currentPage,
      limit,
      totalItems,
      skip,
    })

    return HTTPResponseDto.ok(undefined, { providers, pagination })
  }

  public async getProviderById(id: number): Promise<HTTPResponseDto> {
    const providerEntity = await this.providerRepository.findOne({
      where: { id },
    })

    if (!providerEntity) throw new NotFoundException('Provider not found')
    return HTTPResponseDto.ok(undefined, { providers: [providerEntity] })
  }

  public async updateProvider(
    id: number,
    updateProviderDto: UpdateProviderDto
  ): Promise<HTTPResponseDto> {
    const providerEntity = this.providerRepository.create(updateProviderDto)
    const updateProduct = await this.providerRepository.update(
      {
        id,
        isActive: true,
      },
      providerEntity
    )

    if (!updateProduct.affected)
      throw new NotFoundException('Provider not found')

    return HTTPResponseDto.ok('Provider updated successfully')
  }

  public async deleteProvider(id: number): Promise<HTTPResponseDto> {
    const deleteProvider = await this.providerRepository.update(id, {
      isActive: false,
    })

    if (!deleteProvider.affected)
      throw new NotFoundException('Provider not found')

    return HTTPResponseDto.noContent()
  }
}
