import { Router } from 'express'

import { Action, Resource } from '@config/roles'
import { AppDataSource } from '@core/datasources'
import { AuthMiddleware, FilterMiddleware } from '@core/middlewares'
import { Branch } from '@modules/branch/models'
import { BranchController, BranchService } from '@modules/branch'
import { CreateBranchDto, UpdateBranchDto } from '@modules/branch/dtos'

export class BranchRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const branchRepository = AppDataSource.getRepository(Branch)
    const branchService = new BranchService(branchRepository)
    const controller = new BranchController(branchService)

    const resource = Resource.BRANCH
    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [
        AuthMiddleware.checkPermission(resource, Action.CREATE),
        FilterMiddleware.validateBody([CreateBranchDto]),
      ],
      controller.createBranch
    )
    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getAllBranches
    )
    router.get(
      '/:term',
      [AuthMiddleware.checkPermission(resource, Action.READ)],
      controller.getBranchByTerm
    )
    router.put(
      '/:branchId',
      [AuthMiddleware.checkPermission(resource, Action.UPDATE)],
      controller.updateBranch
    )
    router.delete(
      '/:branchId',
      [AuthMiddleware.checkPermission(resource, Action.DELETE)],
      controller.deleteBranch
    )

    return router
  }
}
