import { NextFunction, Request, Response } from 'express'
import { ForbiddenException, UnauthorizedException } from '@domain/errors'
import { User } from '@db/models'
import { Action, Resource, RoleConfig } from '@config/roles'

export class RoleMiddleware {
  public static checkPermission = (resource: Resource, action: Action) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!res?.locals?.user)
        throw new UnauthorizedException('User not authenticated')

      const user = res.locals.user as User

      user.roles.forEach((role) => {
        const hasPermission =
          RoleConfig[role].permissions[resource].includes(action)

        if (!hasPermission)
          throw new ForbiddenException(
            'You do not have permission to perform this action'
          )

        next()
      })
    }
  }
}
