import winston, { format, Logform, Logger } from 'winston'

type Levels = { [key: string]: number }
type Colors = { [key: string]: string }

interface Options {
  /**
   * Definición de los niveles de log y su severidad correspondiente.
   *
   * @type {Levels}
   */
  levels: Levels

  /**
   * Definición de los colores a usar para cada nivel de log.
   *
   * @type {Colors}
   */
  colors: Colors
}

/**
 * Plugin para configurar y gestionar el logger con `winston`.
 * Permite crear un logger personalizado con niveles de log y colores, así como agregar transportes.
 */
export class LoggerPlugin {
  private constructor(private readonly logger: Logger) {}

  /**
   * Crea una instancia del plugin de logger con la configuración proporcionada.
   *
   * @param {Options} opt - Opciones para la configuración del logger (niveles y colores).
   * @returns {LoggerPlugin} Una instancia del plugin de logger.
   */
  public static create(opt: Options): LoggerPlugin {
    const { levels, colors } = opt
    const logger = LoggerPlugin.createLogger(levels, colors)
    return new LoggerPlugin(logger)
  }

  /**
   * Crea y configura un logger utilizando `winston` con los niveles y colores proporcionados.
   *
   * @param {Levels} levels - Niveles de log definidos por el usuario.
   * @param {Colors} colors - Colores de los niveles de log definidos por el usuario.
   * @returns {Logger} El logger configurado con los niveles y colores.
   */
  private static createLogger(levels: Levels, colors: Colors): Logger {
    winston.addColors(colors)
    return winston.createLogger({
      levels,
      format: format.combine(
        LoggerPlugin.timestampFormat,
        LoggerPlugin.printFormat
      ),
    })
  }

  /**
   * Crea un transporte de consola para mostrar los logs en la consola.
   *
   * @param {string} level - Nivel de log mínimo para mostrar en la consola (e.g., "info", "error").
   * @returns {winston.transport} El transporte configurado para la consola.
   */
  public static createConsoleTransport(level: string): winston.transport {
    return new winston.transports.Console({
      level,
      format: format.combine(
        format.colorize(),
        LoggerPlugin.timestampFormat,
        LoggerPlugin.printFormat
      ),
    })
  }

  /**
   * Agrega un transporte de logging al logger.
   *
   * @param {winston.transport} transport - El transporte que se desea agregar (e.g., consola, archivo).
   */
  public addLoggerTransport(transport: winston.transport) {
    this.logger.add(transport)
  }

  /**
   * Formato para imprimir los logs, que incluye la marca de tiempo, nivel y mensaje.
   *
   * @returns {Logform.Format} El formato de log definido.
   */
  private static get printFormat(): Logform.Format {
    return format.printf(({ level, message, timestamp }) => {
      return `[${timestamp} ${level}] ${message}`
    })
  }

  /**
   * Formato para agregar una marca de tiempo a cada mensaje de log.
   *
   * @returns {Logform.Format} El formato de marca de tiempo.
   */
  private static get timestampFormat(): Logform.Format {
    return format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    })
  }

  /**
   * Método para registrar un mensaje de log con un nivel específico.
   *
   * @param {string} level - Nivel de log (e.g., "info", "warn", "error").
   * @param {string} message - El mensaje a registrar en el log.
   * @param {object} args - Argumentos adicionales a registrar con el mensaje.
   */
  public log = (
    level: string,
    message: string,
    args: { [key: string]: any }
  ) => {
    this.logger.log({ level, message, args })
  }
}
