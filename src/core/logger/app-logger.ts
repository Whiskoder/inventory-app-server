import { Request, Response } from 'express'

import { LoggerPlugin, envs, LoggerTransportPlugin } from '@config/plugins'
import { IHTTPError } from '@/modules/shared/extensions'

/**
 * Interfaz para la estructura de los logs HTTP.
 */
export interface httpInfo {
  log: {
    service: string
    message: string
  }
  [key: string]: unknown
}

/**
 * Enum que define los niveles de severidad para los logs.
 */
export enum LogSeverityLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  HTTP = 'HTTP',
  VERBOSE = 'VERBOSE',
  DEBUG = 'DEBUG',
  SILLY = 'SILLY',
}

/**
 * Clase para gestionar el registro de logs de la aplicación.
 * Permite generar logs en diferentes niveles de severidad y configuraciones.
 */
export class AppLogger {
  constructor(
    private readonly logger: LoggerPlugin,
    private readonly service: string,
    private readonly mode: boolean
  ) {}

  /**
   * Método estático para crear una instancia de `AppLogger`.
   * @param {string} service - Nombre del servicio o componente para el que se está generando el log.
   * @returns {AppLogger} Instancia de `AppLogger`.
   */
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

    // Si el modo es desarrollo, se agrega un transporte para consola.
    if (mode) {
      const consoleTransport = LoggerPlugin.createConsoleTransport(
        LogSeverityLevel.SILLY
      )
      logger.addLoggerTransport(consoleTransport)
    }

    return new AppLogger(logger, service, mode)
  }

  /**
   * Formatea la información de la respuesta HTTP para los logs.
   * @param {Request} req - Objeto de la solicitud HTTP.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @param {IHTTPError} error - Error relacionado con la solicitud HTTP.
   * @returns {object} Información formateada para el log.
   */
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

  /**
   * Registra un mensaje de tipo "INFO".
   * @param {string} message - Mensaje del log.
   * @param {unknown} [metadata] - Información adicional asociada al log.
   */
  public info(message: string, metadata?: unknown) {
    this.log(LogSeverityLevel.INFO, message, metadata)
  }

  /**
   * Registra un mensaje de tipo "ERROR".
   * @param {unknown} error - El error que se está registrando.
   * @param {string} [details] - Detalles adicionales sobre el error.
   */
  public error(error: unknown, details?: string) {
    const message = details || `${error}`
    this.log(LogSeverityLevel.ERROR, message, error)
  }

  /**
   * Registra un error HTTP.
   * @param {Request} req - Objeto de la solicitud HTTP.
   * @param {Response} res - Objeto de la respuesta HTTP.
   * @param {IHTTPError} error - Error HTTP que se está registrando.
   */
  public httpError(req: Request, res: Response, error: IHTTPError) {
    const metadata = this.formatHttpLoggerResponse(req, res, error)
    const message = `[${metadata.request.method}] ${metadata.request.url} - ${error.statusCode} ${error.message} `
    this.log(LogSeverityLevel.HTTP, message, metadata)
  }

  /**
   * Método privado para registrar logs en diferentes niveles de severidad.
   * @param {LogSeverityLevel} logLevel - Nivel de severidad del log.
   * @param {string} message - Mensaje del log.
   * @param {unknown} [metadata] - Información adicional asociada al log.
   */
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

  /**
   * Añade un transporte de log adicional.
   * @param {LoggerTransportPlugin} transport - El transporte que se agregará.
   */
  public addTransport(transport: LoggerTransportPlugin) {
    this.logger.addLoggerTransport(transport)
  }
}
