import {
  LoggerTransportPlugin,
  LoggerTransportPluginOptions,
} from '@/config/plugins'
// import { LogRepositoryImpl } from '@/logs/infrastructure/repositories'
// import { LogEntity } from '@logs/domain/entities'

/**
 * TODO: Requiere la implementación del repositorio de logs.
 * Clase que extiende `LoggerTransportPlugin` para registrar los logs en una base de datos.
 *
 * Esta clase sobrescribe el método `log` para implementar el almacenamiento
 * de logs en la base de datos.
 *
 */
export class LoggerTransportDbUseCase extends LoggerTransportPlugin {
  /**
   * Crea una nueva instancia de `LoggerTransportDbUseCase`.
   *
   * @param {LoggerTransportPluginOptions} opts - Opciones para configurar el transporte de logs.
   */
  constructor(
    opts: LoggerTransportPluginOptions
    // private readonly logRepository: LogRepositoryImpl
  ) {
    super(opts)
  }

  /**
   * TODO: Falta implementar este metodo para guardar los logs en la base de datos
   * Sobrescribe el método `log` para almacenar los logs en la base de datos.
   * Extrae el nivel, timestamp, y los argumentos del log y los pasa al repositorio.
   *
   * @param {any} info - Información del log, que incluye nivel, timestamp y argumentos.
   * @param {() => void} next - Callback para pasar al siguiente middleware o acción de logging.
   * @returns {any} Retorna el resultado de la acción de logging.
   */
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
