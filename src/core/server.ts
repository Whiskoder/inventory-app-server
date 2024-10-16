import express, { Router } from 'express'
import cors from 'cors'

import { ExceptionHandlerMiddleware, FilterMiddleware } from '@core/middlewares'

interface Options {
  port: number
  routes: Router
}

export class Server {
  public readonly app = express()

  private serverListener?: any
  private readonly port: number
  private readonly routes: Router

  constructor(options: Options) {
    this.port = options.port
    this.routes = options.routes
  }

  public async start() {
    const corsOptions = {
      origin: '*', // Allow all origins, you can specify domains as an array here
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    }
    //* Middlewares
    this.app.use(cors(corsOptions)) // Enable CORS
    this.app.use(express.json()) // Enable JSON parsing

    //* Routes
    this.app.use(this.routes)

    //* Routes error handling
    this.app.use(FilterMiddleware.invalidRoute)

    //* Error filter handler
    this.app.use(ExceptionHandlerMiddleware.handle)
    this.serverListener = this.app.listen(this.port)
  }

  public async close() {
    if (!this.serverListener) return
    await this.serverListener.close()
  }
}
