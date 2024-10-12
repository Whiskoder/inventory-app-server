import { Request, Response } from 'express'

import { NotFoundException } from '@core/errors'

export class FilterMiddleware {
  public static invalidRoute = (req: Request, res: Response) => {
    const path = req.originalUrl
    const method = req.method
    throw new NotFoundException(`Cannot ${method.toUpperCase()} ${path}`)
  }

  // fix filtering cases with query string, example price[lte]=2
  // public static validateQuery(constructors?: ClassConstructor<any>[]) {
  //   return async (req: Request, res: Response, next: NextFunction) => {
  //     const hasForeignKeys = FilterMiddleware.hasForeignKeys(
  //       req.query || {},
  //       constructors
  //     )
  //     if (hasForeignKeys)
  //       throw new BadRequestException(
  //         `Query properties ${hasForeignKeys.join(', ')} are not allowed`
  //       )

  //     next()
  //   }
  // }

  // public static validateBody(constructors?: ClassConstructor<any>[]) {
  //   return async (req: Request, res: Response, next: NextFunction) => {
  //     const hasForeignKeys = FilterMiddleware.hasForeignKeys(
  //       req.body || {},
  //       constructors
  //     )
  //     if (hasForeignKeys)
  //       throw new BadRequestException(
  //         `Body properties ${hasForeignKeys.join(', ')} are not allowed`
  //       )

  //     next()
  //   }
  // }

  // private static hasForeignKeys(
  //   object: { [key: string]: any },
  //   constructors?: ClassConstructor<any>[]
  // ) {
  //   const objectKeys = Object.keys(object)

  //   if (!constructors) {
  //     if (objectKeys.length > 0) return objectKeys
  //     return false
  //   }

  //   const instances = constructors.map((constructor) => new constructor())
  //   const validKeys: string[] = []

  //   instances.forEach((instance) => {
  //     Object.keys(instance).forEach((key) => {
  //       validKeys.push(key)
  //     })
  //   })

  //   const foreignKeys = objectKeys.filter((key) => !validKeys.includes(key))

  //   if (foreignKeys.length > 0) return foreignKeys

  //   return false
  // }
}
