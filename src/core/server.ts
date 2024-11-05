import express, { Router } from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'

import {
  ExceptionHandlerMiddleware,
  FilterMiddleware,
  ThrottlerMiddleware,
} from '@core/middlewares'

interface Options {
  port: number
  routes: Router
}

/**
 * Clase que representa el servidor de la aplicación.
 * Gestiona la configuración del servidor Express, la carga de rutas y la integración de middlewares.
 *
 * El servidor puede iniciar y detenerse dinámicamente en función de las configuraciones proporcionadas.
 */
export class Server {
  public readonly app = express()

  private serverListener?: any
  private readonly port: number
  private readonly routes: Router

  /**
   * Crea una nueva instancia del servidor.
   *
   * @param {Options} options Configuración del servidor que incluye el puerto y las rutas.
   */
  constructor(options: Options) {
    this.port = options.port
    this.routes = options.routes
  }

  /**
   * Inicia el servidor Express y configura los middlewares, rutas y manejo de errores.
   *
   * Este método configura los middlewares para manejo de archivos, CORS, JSON, limitación de solicitudes,
   * y la gestión de errores tanto para rutas no encontradas como para excepciones.
   *
   * @returns {Promise<void>} Promesa que indica que el servidor ha sido iniciado correctamente.
   */
  public async start() {
    //* Middlewares
    this.app.use(ThrottlerMiddleware.limit()) // Límite de solicitudes para evitar abuso
    this.app.use(cors()) // Habilita CORS (Compartición de Recursos de Origen Cruzado)
    this.app.use(express.json()) // Habilita la conversion a JSON en las solicitudes
    this.app.use(
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }, // Establece un límite de tamaño de archivo de 50MB
      })
    )
    //* Rutas
    this.app.use(this.routes)

    //* Manejo de rutas no válidas
    this.app.use(FilterMiddleware.invalidRoute)

    //* Manejo global de errores
    this.app.use(ExceptionHandlerMiddleware.handle)
    this.serverListener = this.app.listen(this.port)
  }

  /**
   * Detiene el servidor si está en ejecución.
   *
   * @returns {Promise<void>} Promesa que indica que el servidor ha sido detenido correctamente.
   */
  public async close() {
    if (!this.serverListener) return
    await this.serverListener.close()
  }
}
