import { NextFunction, Request, Response } from 'express'
import { ForbiddenException, UnauthorizedException } from '@domain/errors'
import { JWT } from '@config/plugins'
import { AppDataSource } from '@db/datasources'
import { User } from '@db/models'

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
}
