import winston, { format, Logform, Logger } from 'winston'

type Levels = { [key: string]: number }
type Colors = { [key: string]: string }

interface Options {
  levels: Levels
  colors: Colors
}

export class LoggerPlugin {
  private constructor(private readonly logger: Logger) {}

  public static create(opt: Options): LoggerPlugin {
    const { levels, colors } = opt
    const logger = LoggerPlugin.createLogger(levels, colors)
    return new LoggerPlugin(logger)
  }

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

  public addLoggerTransport(transport: winston.transport) {
    this.logger.add(transport)
  }

  private static get printFormat(): Logform.Format {
    return format.printf(({ level, message, timestamp }) => {
      return `[${timestamp} ${level}] ${message}`
    })
  }

  private static get timestampFormat(): Logform.Format {
    return format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    })
  }

  public log = (
    level: string,
    message: string,
    args: { [key: string]: any }
  ) => {
    this.logger.log({ level, message, args })
  }
}
