import 'dotenv/config'
import { get } from 'env-var'

/**
 * Carga las variables de entorno necesarias para la configuración de la aplicación.
 * Utiliza la librería `env-var` para obtener y validar los valores de las variables de entorno.
 */
export const envs = {
  /**
   * Dirección del servidor de la base de datos.
   *
   * @type {string}
   */
  DB_HOST: get('DB_HOST').required().asString(),

  /**
   * Nombre de la base de datos.
   *
   * @type {string}
   */
  DB_NAME: get('DB_NAME').required().asString(),

  /**
   * Contraseña de la base de datos.
   *
   * @type {string}
   */
  DB_PASS: get('DB_PASS').required().asString(),

  /**
   * Puerto de conexión de la base de datos.
   *
   * @type {number}
   */
  DB_PORT: get('DB_PORT').required().asPortNumber(),

  /**
   * Indica si la conexión a la base de datos debe ser segura (SSL).
   *
   * @type {boolean}
   */
  DB_SSL: get('DB_SSL').required().asBool(),

  /**
   * Indica si la base de datos debe sincronizarse automáticamente al iniciar.
   *
   * @type {boolean}
   */
  DB_SYNC: get('DB_SYNC').required().asBool(),

  /**
   * Número máximo de reintentos para la conexión a la base de datos.
   *
   * @type {number}
   */
  DB_MAX_RETRIES: get('DB_MAX_RETRIES').required().asIntPositive(),

  /**
   * Retraso entre los reintentos de conexión a la base de datos, en milisegundos.
   *
   * @type {number}
   */
  DB_RETRY_DELAY_MS: get('DB_RETRY_DELAY_MS').required().asIntPositive(),

  /**
   * Usuario de la base de datos.
   *
   * @type {string}
   */
  DB_USER: get('DB_USER').required().asString(),

  /**
   * Dirección del servidor de correo.
   *
   * @type {string}
   */
  MAILER_HOST: get('MAILER_HOST').required().asString(),

  /**
   * Contraseña del servidor de correo.
   *
   * @type {string}
   */
  MAILER_PASS: get('MAILER_PASS').required().asString(),

  /**
   * Puerto del servidor de correo.
   *
   * @type {number}
   */
  MAILER_PORT: get('MAILER_PORT').required().asPortNumber(),

  /**
   * Usuario para autenticar en el servidor de correo.
   *
   * @type {string}
   */
  MAILER_USER: get('MAILER_USER').required().asString(),

  /**
   * Entorno de ejecución de la aplicación (ej. "development", "production").
   *
   * @type {string}
   */
  NODE_ENV: get('NODE_ENV').required().asString(),

  /**
   * Puerto en el que corre la aplicación.
   *
   * @type {number}
   */
  PORT: get('PORT').required().asPortNumber(),

  /**
   * Indica si se deben enviar correos electrónicos.
   *
   * @type {boolean}
   */
  SEND_EMAIL: get('SEND_EMAIL').required().asBool(),

  /**
   * Secreto para la firma de los JWT.
   *
   * @type {string}
   */
  JWT_SECRET: get('JWT_SECRET').required().asString(),

  /**
   * Endpoint del servicio de almacenamiento de archivos (bucket).
   *
   * @type {string}
   */
  BUCKET_ENDPOINT: get('BUCKET_ENDPOINT').required().asString(),

  /**
   * Nombre del bucket de almacenamiento.
   *
   * @type {string}
   */
  BUCKET_NAME: get('BUCKET_NAME').required().asString(),

  /**
   * ID de cliente para acceder al servicio de almacenamiento.
   *
   * @type {string}
   */
  BUCKET_CLIENT_ID: get('BUCKET_CLIENT_ID').required().asString(),

  /**
   * Secreto de cliente para acceder al servicio de almacenamiento.
   *
   * @type {string}
   */
  BUCKET_CLIENT_SECRET: get('BUCKET_CLIENT_SECRET').required().asString(),
}
