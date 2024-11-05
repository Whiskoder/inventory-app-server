import { rateLimit } from 'express-rate-limit'
import { TooManyRequestsException } from '@core/errors'

/**
 * Middleware que implementa la limitación de tasa de solicitudes (Rate Limiting).
 * Controla la cantidad de solicitudes que un cliente puede realizar en un tiempo determinado.
 */
export class ThrottlerMiddleware {
  /**
   * Limita la cantidad de solicitudes que un cliente puede realizar dentro de un intervalo de tiempo.
   *
   * @param {number} windowMs - El intervalo de tiempo en milisegundos durante el cual se aplica la
   *                            limitación de solicitudes.
   *                            El valor predeterminado es 15 minutos (1000 * 60 * 15).
   *
   * @param {number} limit - El número máximo de solicitudes permitidas durante el intervalo de tiempo.
   *                         El valor predeterminado es 1000 solicitudes.
   *
   * @returns {import("express-rate-limit").RequestHandler} - Un middleware que se encarga de
   *                                                          verificar la tasa de solicitudes.
   *
   * @throws {TooManyRequestsException} - Lanza una excepción `TooManyRequestsException` si se
   *                                      supera el límite de solicitudes.
   */
  public static limit = (
    windowMs: number = 1000 * 60 * 15, // 15 minutos por defecto
    limit: number = 1000 // 1000 solicitudes por defecto
  ) => {
    return rateLimit({
      windowMs, // Tiempo de la ventana de limitación en milisegundos
      limit, // Número máximo de solicitudes permitidas
      handler: () => {
        // Lanza una excepción si se supera el límite de solicitudes
        throw new TooManyRequestsException()
      },
    })
  }
}
