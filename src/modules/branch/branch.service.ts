import { Repository } from 'typeorm'

import { Branch } from '@modules/branch/models'
import { CreateBranchDto, UpdateBranchDto } from '@modules/branch/dtos'
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

  public async getAllBranches(
    paginationDto: CreatePaginationDto,
    sortingDto: CreateSortingDto
  ): Promise<CreateHTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const { sortBy, orderBy } = sortingDto

    const [branches, totalItems] = await this.branchRepository.findAndCount({
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

    return CreateHTTPResponseDto.ok(undefined, { branches, pagination })
  }

  public async getBranchByTerm(term: string): Promise<CreateHTTPResponseDto> {
    let branchEntity
    if (Number(term)) {
      branchEntity = await this.branchRepository.findOne({
        where: { id: +term, isActive: true },
      })
    } else {
      branchEntity = await this.branchRepository.findOne({
        where: { name: term.toLowerCase(), isActive: true },
      })
    }

    if (!branchEntity) throw new NotFoundException('Branch not found')
    return CreateHTTPResponseDto.ok(undefined, { branches: [branchEntity] })
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
}
