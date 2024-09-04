import { Request, Response } from 'express'

export class TestController {
  constructor() {}

  public helloWorld = (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Hello World' })
  }
}
