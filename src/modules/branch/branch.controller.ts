import { NextFunction, Request, Response } from 'express'
import { BranchService } from '@modules/branch'
import { CreateBranchDto, UpdateBranchDto } from '@modules/branch/dtos'
import { PaginationDto } from '@modules/shared/dtos'

export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  //POST '/api/v1/branch'
  public createBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = res.locals.body
      const response = await this.branchService.createBranch(dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/branch'
  public getAllBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this.branchService.getAllBranches(res.locals.query)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/branch/:term'
  public getBranchByTerm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this.branchService.getBranchByTerm(req.params.term)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //PUT '/api/v1/branch/:branchId'
  public updateBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const branchId = +req.params.branchId
      const dto = await UpdateBranchDto.create(req.body)
      const response = await this.branchService.updateBranch(branchId, dto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //DELETE '/api/v1/branch/:branchId'
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
