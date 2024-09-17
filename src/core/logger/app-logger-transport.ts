import {
  LoggerTransportPlugin,
  LoggerTransportPluginOptions,
} from '@/config/plugins'
// import { LogRepositoryImpl } from '@/logs/infrastructure/repositories'
// import { LogEntity } from '@logs/domain/entities'

export class LoggerTransportDbUseCase extends LoggerTransportPlugin {
  constructor(
    opts: LoggerTransportPluginOptions
    // private readonly logRepository: LogRepositoryImpl
  ) {
    super(opts)
  }

  public log(info: any, next: () => void): any {
    const { level, timestamp, args } = info
    const { service, metadata, message } = args
    // const logEntity = LogEntity.create({
    //   level,
    //   message,
    //   createdAt: timestamp,
    //   service,
    //   metadata,
    // })
    // this.logRepository.create({ logEntity })
    next()
  }
}
