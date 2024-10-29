import { Router } from 'express'

import { Actions, Resources } from '@modules/user/enums'
import { AppDataSource } from '@core/datasources'
import { AuthMiddleware } from '@core/middlewares'
import { Branch } from '@modules/branch/models'
import { BranchController, BranchService } from '@modules/branch'

export class BranchRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const branchRepository = AppDataSource.getRepository(Branch)
    const branchService = new BranchService(branchRepository)
    const controller = new BranchController(branchService)

    const resource = Resources.BRANCH
    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.createBranch
    )

    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getBranchList
    )

    router.get(
      '/:branchId',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getBranchById
    )

    router.put(
      '/:branchId',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.updateBranch
    )

    router.delete(
      '/:branchId',
      [AuthMiddleware.checkPermission(resource, Actions.DELETE)],
      controller.deleteBranch
    )

    return router
  }
}
