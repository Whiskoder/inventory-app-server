import { Equal, Like, Repository } from 'typeorm'

import { Branch } from '@modules/branch/models'
import {
  RelationsBranchDto,
  CreateBranchDto,
  UpdateBranchDto,
  FilterBranchDto,
} from '@modules/branch/dtos'
import {
  CreateHTTPResponseDto,
  CreatePaginationDto,
  CreateSortingDto,
} from '@modules/shared/dtos'
import { InternalServerErrorException, NotFoundException } from '@core/errors'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'
import { UUID } from '@config/plugins'

export class BranchService {
  constructor(private readonly branchRepository: Repository<Branch>) {}

  public async createBranch(
    createBranchDto: CreateBranchDto
  ): Promise<CreateHTTPResponseDto> {
    const branchEntity = this.branchRepository.create(createBranchDto)
    await this.branchRepository.save(branchEntity)

    return CreateHTTPResponseDto.created('Branch created succesfully', {
      branches: [branchEntity],
    })
  }

  public async getBranchById(
    branchId: number,
    relationsDto: RelationsBranchDto
  ): Promise<CreateHTTPResponseDto> {
    const branchEntity = await this.branchRepository.findOne({
      where: { id: branchId, isActive: true },
      relations: [...relationsDto.include],
    })

    if (!branchEntity) throw new NotFoundException('Branch not found')
    return CreateHTTPResponseDto.ok(undefined, { branches: [branchEntity] })
  }

  public async getBranchList(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto,
    relationsDto: RelationsBranchDto,
    filterDto: FilterBranchDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip } = paginationDto
    const { sortBy, orderBy } = sortingDto

    let order: any = { [sortBy]: orderBy }
    if (sortBy === 'order') order = { orders: { id: orderBy } }
    if (sortBy === 'employee') order = { employees: { name: orderBy } }

    const [branches, totalItems] = await this.branchRepository.findAndCount({
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

    if (branches.length === 0) throw new NotFoundException('Branches not found')

    return CreateHTTPResponseDto.ok(undefined, { branches, pagination })
  }

  public async updateBranch(
    branchId: number,
    updateBranchDto: UpdateBranchDto
  ): Promise<CreateHTTPResponseDto> {
    const branchEntity = this.branchRepository.create(updateBranchDto)
    const updatedBranch = await this.branchRepository.update(
      { isActive: true, id: branchId },
      branchEntity
    )

    if (!updatedBranch.affected) throw new NotFoundException('Branch not found')

    return CreateHTTPResponseDto.ok('Branch updated successfully')
  }

  public async deleteBranch(branchId: number): Promise<CreateHTTPResponseDto> {
    const branchEntity = await this.branchRepository.findOne({
      where: { id: branchId, isActive: true },
    })

    if (!branchEntity) throw new NotFoundException('Branch not found')
    const name = branchEntity.name + '_' + UUID.nanoid()
    const deletedBranch = await this.branchRepository.update(
      { id: branchId },
      { isActive: false, name }
    )

    if (!deletedBranch.affected)
      throw new InternalServerErrorException('Error deleting branch')

    return CreateHTTPResponseDto.noContent()
  }

  private createFilter(filterDto: FilterBranchDto) {
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

    return where
  }
}
