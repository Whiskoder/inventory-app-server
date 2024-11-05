import { NextFunction, Request, Response } from 'express'

import { Actions, Resources } from '@modules/user/enums'
import { RoleConfig } from '@config/role.config'
import { AppDataSource } from '@core/datasources'
import { ForbiddenException, UnauthorizedException } from '@core/errors'
import { JWT } from '@config/plugins'
import { User } from '@modules/user/models'
import { ErrorMessages } from '@modules/shared/enums/messages'

/**
 * Middleware de autenticación que valida el token JWT del usuario.
 */
export class AuthMiddleware {
  /**
   * Valida el token JWT enviado en la cabecera de autorización.
   * Si el token es válido, decodifica el payload y carga el usuario en `res.locals`.
   * @param {Request} req - Objeto de la solicitud HTTP.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @param {NextFunction} next - Función que pasa al siguiente middleware.
   * @throws {UnauthorizedException} Si no se proporciona un token o es inválido.
   */
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

  /**
   * Middleware que verifica si el usuario tiene los permisos necesarios para una acción en un recurso específico.
   * @param {Resources} resource - El recurso que el usuario quiere acceder.
   * @param {Actions} action - La acción que el usuario quiere realizar sobre el recurso.
   * @returns {Function} Middleware que verifica los permisos del usuario.
   * @throws {ForbiddenException} Si el usuario no tiene el permiso requerido.
   */
  public static checkPermission = (resource: Resources, action: Actions) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = res.locals.user as User

      const hasPermission =
        RoleConfig[user.role].permissions[resource].includes(action)

      if (!hasPermission)
        throw new ForbiddenException(ErrorMessages.ForbiddenException)

      next()
    }
  }
}
