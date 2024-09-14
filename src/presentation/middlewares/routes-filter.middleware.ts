import { NotFoundException } from '@/domain/errors'
import { Request, Response } from 'express'

export class RoutesFilterMiddleware {
  public static notFoundHandler = (req: Request, res: Response) => {
    const path = req.originalUrl
    const method = req.method
    throw new NotFoundException(`Cannot ${method.toUpperCase()} ${path}`)
  }
}
