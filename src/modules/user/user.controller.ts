import { NextFunction, Request, Response } from 'express'

import { UserService } from '@modules/user'

export class UserController {
  constructor(private readonly userService: UserService) {}
}
