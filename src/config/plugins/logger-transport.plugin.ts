import Transport from 'winston-transport'
import { Format } from 'logform'

/**
 * Opciones de configuración para el plugin de transporte del logger.
 *
 * Estas opciones definen cómo se debe gestionar el comportamiento de los logs,
 * incluyendo formato, nivel, manejo de excepciones y más.
 */
export interface LoggerTransportPluginOptions {
  /**
   * Formato del log. Permite personalizar la estructura de los mensajes de log.
   *
   * @type {Format}
   */
  format?: Format

  /**
   * Nivel de log. Define la severidad de los mensajes (e.g., "info", "warn", "error").
   *
   * @type {string}
   */
  level?: string

  /**
   * Si es `true`, no se enviarán mensajes de log.
   *
   * @type {boolean}
   * @default false
   */
  silent?: boolean

  /**
   * Si es `true`, se gestionarán las excepciones no capturadas.
   *
   * @type {boolean}
   * @default false
   */
  handleExceptions?: boolean

  /**
   * Si es `true`, se gestionarán las promesas rechazadas no manejadas.
   *
   * @type {boolean}
   * @default false
   */
  handleRejections?: boolean

  /**
   * Función personalizada para procesar los logs de nivel `info`.
   *
   * @param {any} info - El objeto de información del log.
   * @param {() => void} next - Función que debe ser llamada para pasar el log al siguiente transporte.
   * @returns {any} - El objeto de información procesado.
   */
  log?(info: any, next: () => void): any

  /**
   * Función personalizada para procesar los logs de nivel `verbose`.
   *
   * @param {any} info - El objeto de información del log.
   * @param {() => void} next - Función que debe ser llamada para pasar el log al siguiente transporte.
   * @returns {any} - El objeto de información procesado.
   */
  logv?(info: any, next: () => void): any

  /**
   * Función para cerrar el transporte de logs cuando ya no sea necesario.
   *
   * @returns {void}
   */
  close?(): void
}

/**
 * Clase abstracta para crear un plugin de transporte de logs en `winston`.
 *
 * Los desarrolladores pueden extender esta clase para implementar su propio
 * transporte de logs personalizado.
 */
export abstract class LoggerTransportPlugin extends Transport {
  /**
   * Constructor del plugin de transporte de logs.
   *
   * @param {LoggerTransportPluginOptions} opts - Opciones de configuración para el transporte.
   */
  constructor(opts: LoggerTransportPluginOptions) {
    super(opts)
  }
}
