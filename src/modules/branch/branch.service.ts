import { Repository } from 'typeorm'

import { Branch } from '@modules/branch/models'
import { CreateBranchDto, UpdateBranchDto } from '@modules/branch/dtos'
import { HTTPResponseDto, PaginationDto } from '@modules/shared/dtos'
import { NotFoundException } from '@core/errors'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'

export class BranchService {
  constructor(private readonly branchRepository: Repository<Branch>) {}

  public async createBranch(
    createBranchDto: CreateBranchDto
  ): Promise<HTTPResponseDto> {
    const isExistingBranch = await this.branchRepository.update(
      { name: createBranchDto.name, isActive: false },
      { isActive: true }
    )

    if (isExistingBranch.affected === 1)
      return HTTPResponseDto.accepted(
        `Branch ${createBranchDto.name} already exists`
      )
    const branchEntity = this.branchRepository.create(createBranchDto)
    await this.branchRepository.save(branchEntity)

    return HTTPResponseDto.created('Branch created succesfully', {
      branches: [branchEntity],
    })
  }

  public async getAllBranches(
    paginationDto: PaginationDto
  ): Promise<HTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const [branches, totalItems] = await this.branchRepository.findAndCount({
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

    return HTTPResponseDto.ok(undefined, { branches, pagination })
  }

  public async getBranchByTerm(term: string): Promise<HTTPResponseDto> {
    let branch
    if (Number(term)) {
      branch = await this.branchRepository.findOne({
        where: { id: +term, isActive: true },
      })
    } else {
      branch = await this.branchRepository.findOne({
        where: { name: term.toLowerCase(), isActive: true },
      })
    }

    if (!branch) throw new NotFoundException('Branch not found')
    return HTTPResponseDto.ok(undefined, { branches: [branch] })
  }

  public async updateBranch(
    branchId: number,
    updateBranchDto: UpdateBranchDto
  ): Promise<HTTPResponseDto> {
    const branchEntity = this.branchRepository.create(updateBranchDto)
    const updateBranch = await this.branchRepository.update(
      { isActive: true, id: branchId },
      branchEntity
    )

    if (!updateBranch.affected) throw new NotFoundException('Branch not found')

    return HTTPResponseDto.ok('Branch updated successfully')
  }

  public async deleteBranch(branchId: number): Promise<HTTPResponseDto> {
    const deleteBranch = await this.branchRepository.update(
      { id: branchId },
      { isActive: false }
    )

    if (!deleteBranch.affected) throw new NotFoundException('Branch not found')

    return HTTPResponseDto.noContent()
  }
}
