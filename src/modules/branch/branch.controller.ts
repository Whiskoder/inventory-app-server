import { NextFunction, Request, Response } from 'express'

import { BranchService } from '@modules/branch'
import {
  RelationsBranchDto,
  CreateBranchDto,
  UpdateBranchDto,
  FilterBranchDto,
} from '@modules/branch/dtos'
import { CreatePaginationDto, CreateSortingDto } from '@modules/shared/dtos'

export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  //POST '/api/v1/branches/'
  public createBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createBranchDto = await CreateBranchDto.create(req.body)
      const response = await this.branchService.createBranch(createBranchDto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/branches/:branchId'
  public getBranchById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const branchId = +req.params.branchId
      const relationsDto = await RelationsBranchDto.create(req.query)
      const response = await this.branchService.getBranchById(
        branchId,
        relationsDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/branches/'
  public getBranchList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const props = [
        'cityName',
        'contactEmail',
        'contactPhone',
        'dependantLocality',
        'name',
        'postalCode',
        'streetName',
        'employee',
        'order',
      ]
      const paginationDto = await CreatePaginationDto.create(req.query)
      const sortingDto = await CreateSortingDto.create(req.query, props)
      const relationsDto = await RelationsBranchDto.create(req.query)
      const filterDto = await FilterBranchDto.create(req.query)

      const response = await this.branchService.getBranchList(
        paginationDto,
        sortingDto,
        relationsDto,
        filterDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //PUT '/api/v1/branches/:branchId'
  public updateBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const branchId = +req.params.branchId
      const updateBranchDto = await UpdateBranchDto.create(req.body)
      const response = await this.branchService.updateBranch(
        branchId,
        updateBranchDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //DELETE '/api/v1/branches/:branchId'
  public deleteBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const branchId = +req.params.branchId
      const response = await this.branchService.deleteBranch(branchId)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }
}
