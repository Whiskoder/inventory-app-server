import express, { Router } from 'express'
import cors from 'cors'

import { ExceptionHandlerMiddleware, FilterMiddleware } from '@core/middlewares'

interface Options {
  port: number
  routes: Router
}

export class Server {
  public readonly app = express()

  private serverListener?: Server
  private readonly port: number
  private readonly routes: Router

  constructor(options: Options) {
    this.port = options.port
    this.routes = options.routes
  }

  public async start() {
    //* Middlewares
    this.app.use(cors()) // Enable CORS
    this.app.use(express.json()) // Enable JSON parsing

    //* Routes
    this.app.use(this.routes)

    //* Routes error handling
    this.app.use(FilterMiddleware.invalidRoute)

    //* Error filter handler
    this.app.use(ExceptionHandlerMiddleware.handle)
    this.app.listen(this.port)
  }

  public async close() {
    if (!this.serverListener) return
    this.serverListener.close()
  }
}
