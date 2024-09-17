import Transport from 'winston-transport'
import { Format } from 'logform'

export interface LoggerTransportPluginOptions {
  format?: Format
  level?: string
  silent?: boolean
  handleExceptions?: boolean
  handleRejections?: boolean
  log?(info: any, next: () => void): any
  logv?(info: any, next: () => void): any
  close?(): void
}

export abstract class LoggerTransportPlugin extends Transport {
  constructor(opts: LoggerTransportPluginOptions) {
    super(opts)
  }
}
