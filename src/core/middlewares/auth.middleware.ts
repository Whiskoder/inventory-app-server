import { NextFunction, Request, Response } from 'express'

import { Action, Resource, RoleConfig } from '@config/roles'
import { AppDataSource } from '@core/datasources'
import { ForbiddenException, UnauthorizedException } from '@core/errors'
import { JWT } from '@config/plugins'
import { User } from '@modules/user/models'

export class AuthMiddleware {
  public static async validateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const authorization = req.header('Authorization')

    if (!authorization) throw new UnauthorizedException('No token provided')
    if (!authorization?.startsWith('Bearer '))
      throw new UnauthorizedException('Invalid Bearer Token')

    const token = authorization.split(' ').at(1) || ''

    try {
      const jwtPlugin = JWT.instance()
      const payload = await jwtPlugin.verifyToken<{ id: string }>({ token })
      if (!payload) throw new UnauthorizedException('Invalid token')

      const id = +payload.id

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({ id })
      if (!user) throw new UnauthorizedException('Invalid token')

      const { password, ...userEntity } = user
      res.locals.user = userEntity
      next()
    } catch (e) {
      next(e)
    }
  }

  public static checkPermission = (resource: Resource, action: Action) => {
    return (req: Request, res: Response, next: NextFunction) => {
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
