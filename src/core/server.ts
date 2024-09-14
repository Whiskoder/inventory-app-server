import express, { Router } from 'express'
import cors from 'cors'
import {
  ExceptionHandlerMiddleware,
  RoutesFilterMiddleware,
} from '@presentation/middlewares'

type Mode = 'development' | 'production'

interface Options {
  mode: Mode
  port: number
  routes: Router
}

export class Server {
  public readonly app = express()

  private serverListener?: Server
  private readonly mode: Mode
  private readonly port: number
  private readonly routes: Router

  constructor(options: Options) {
    this.mode = options.mode
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
    this.app.use(RoutesFilterMiddleware.notFoundHandler)

    //* Error filter handler
    this.app.use(ExceptionHandlerMiddleware.handle)

    this.app.listen(this.port, () => {
      if (this.mode === 'development')
        console.log(`Server running on http://localhost:${this.port}`)
    })
  }

  public async close() {
    if (!this.serverListener) return
    this.serverListener.close()
  }
}
