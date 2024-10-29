import { NextFunction, Request, Response } from 'express'
import { BadRequestException } from '../errors'

export class FileUploadMiddleware {
  static containFiles(req: Request, res: Response, next: NextFunction) {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new BadRequestException('No files were selected')
    }

    if (!Array.isArray(req.files.file)) {
      res.locals.files = [req.files.file]
    } else {
      res.locals.files = req.files.file
    }

    next()
  }
}
