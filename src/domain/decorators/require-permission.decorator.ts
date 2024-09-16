import { Request, Response, NextFunction } from 'express'
import { Action, Resource } from '@config/roles'
import { AuthMiddleware } from '@/presentation/middlewares'

// export function RequirePermission(resource: Resource, action: Action) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const validate = AuthMiddleware.validateToken
//     const checkPermission = AuthMiddleware.checkPermission(resource, action)

//     Promise.resolve(validate(req, res, () => {}))
//       .then(() => {
//         return checkPermission(req, res, next)
//       })
//       .catch(next)
//   }
// }
// const formatMetadataKey = Symbol('format')

// export function RequirePermission(resource: Resource, action: Action) {
//   return (
//     target: any,
//     propertyKey: string,
//     descriptor?: TypedPropertyDescriptor<any>
//   ) => {
// if (!descriptor) return

// const originalMethod = descriptor?.value
// console.log(descriptor?.value)

// descriptor.value = async function (
//   ...args: [Request, Response, NextFunction]
// ) {
//   const req = args[0]
//   const res = args[1]
//   const next = args[2]

//   try {
//     await AuthMiddleware.validateToken(req, res, () => {})
//     AuthMiddleware.checkPermission(resource, action)(req, res, next)
//     console.log('xd')
//     return originalMethod.apply(this, args)
//   } catch (error) {
//     next(error)
//   }
// }

// return descriptor
//   }
// }

export function RequirePermission(resource: Resource, action: Action) {
  return (target: any, propertyKey: string | symbol) => {
    const originalValue = new target.constructor()
    console.log(target[propertyKey])
    const originalDescriptor = Reflect.getOwnPropertyDescriptor(
      new target.constructor(),
      propertyKey
    )
    if (typeof originalDescriptor?.value !== 'function') return

    const originalFunction = originalDescriptor.value

    Reflect.defineProperty(target.constructor.prototype, propertyKey, {
      value: async function (...args: [Request, Response, NextFunction]) {
        const req = args[0]
        const res = args[1]
        const next = args[2]
        try {
          await AuthMiddleware.validateToken(req, res, () => {})
          AuthMiddleware.checkPermission(resource, action)(req, res, next)
          return originalFunction.apply(this, args)
        } catch (error) {
          next(error)
        }
      },
      writable: true,
      enumerable: true,
      configurable: true,
    })
  }
}
