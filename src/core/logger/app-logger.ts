import { Request, Response } from 'express'

import { LoggerPlugin, envs, LoggerTransportPlugin } from '@config/plugins'
import { IHTTPError } from '@/modules/shared/extensions'

export interface httpInfo {
  log: {
    service: string
    message: string
  }
  [key: string]: unknown
}

export enum LogSeverityLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  HTTP = 'HTTP',
  VERBOSE = 'VERBOSE',
  DEBUG = 'DEBUG',
  SILLY = 'SILLY',
}

export class AppLogger {
  constructor(
    private readonly logger: LoggerPlugin,
    private readonly service: string,
    private readonly mode: boolean
  ) {}

  public static create(service: string): AppLogger {
    const levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      HTTP: 3,
      VERBOSE: 4,
      DEBUG: 5,
      SILLY: 6,
    }
    const colors = {
      ERROR: 'red',
      WARN: 'yellow',
      INFO: 'green',
      HTTP: 'blue',
      VERBOSE: 'cyan',
      DEBUG: 'grey',
      SILLY: 'grey',
    }

    const mode = envs.NODE_ENV === 'development'

    const logger = LoggerPlugin.create({
      levels,
      colors,
    })

    if (mode) {
      const consoleTransport = LoggerPlugin.createConsoleTransport(
        LogSeverityLevel.SILLY
      )
      logger.addLoggerTransport(consoleTransport)
    }

    return new AppLogger(logger, service, mode)
  }

  private formatHttpLoggerResponse = (
    req: Request,
    res: Response,
    error: IHTTPError
  ) => {
    return {
      request: {
        headers: req.headers,
        host: req.headers.host,
        baseUrl: req.baseUrl,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req?.params,
        query: req?.query,
        clientIp:
          req?.headers['x-forwarded-for'] ??
          req?.socket.remoteAddress ??
          'unknown',
      },
      response: {
        headers: res.getHeaders(),
        statusCode: res.statusCode,
      },
      error,
    }
  }

  public info(message: string, metadata?: unknown) {
    this.log(LogSeverityLevel.INFO, message, metadata)
  }

  public error(error: unknown, details?: string) {
    const message = details || `${error}`
    this.log(LogSeverityLevel.ERROR, message, error)
  }

  public httpError(req: Request, res: Response, error: IHTTPError) {
    const metadata = this.formatHttpLoggerResponse(req, res, error)
    const message = `[${metadata.request.method}] ${metadata.request.url} - ${error.statusCode} ${error.message} `
    this.log(LogSeverityLevel.HTTP, message, metadata)
  }

  private log(logLevel: LogSeverityLevel, message: string, metadata?: unknown) {
    if (!this.mode) return

    const args = {
      metadata,
      message,
      service: this.service,
    }

    const logMessage = `[${this.service}] ${message}`

    this.logger.log(logLevel, logMessage, args)
  }

  // public httpError(
  //       req: Request,
  //   res: Response,
  //   body: httpError
  // ) {
  //   const metadata = this.formatHttpLoggerResponse(req, res, body)
  //   const message = body.error?.message ?? 'Error request'
  //   const logMessage = `[${res.statusCode}] [${service}] ${message}`
  //   const args = this.createArgs(service, message, metadata)
  //   this.logger.log(LogSeverityLevel.HTTP, logMessage, args)
  // }

  // public httpInfo(req: Request, res: Response, body: httpInfo) {
  //   const metadata = this.formatHttpLoggerResponse(req, res, body)
  //   const message = body?.log?.message ?? 'Info request'
  //   const origin = body?.log?.service ?? 'unknown'
  //   const logMessage = `[${res.statusCode}] [${service}] [${origin}] ${message}`
  //   const args = this.createArgs(service, message, metadata)
  //   this.logger.log(LogSeverityLevel.HTTP, logMessage, args)
  // }

  public addTransport(transport: LoggerTransportPlugin) {
    this.logger.addLoggerTransport(transport)
  }
}
