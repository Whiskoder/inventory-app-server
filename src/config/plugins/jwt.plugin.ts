import { jwtVerify, SignJWT } from 'jose'

import { InternalServerErrorException } from '@core/errors'
import { envs } from '@config/plugins'

/**
 * Opciones para generar un nuevo token JWT.
 */
export interface GenerateTokenOptions {
  /**
   * Carga de información (payload) que se incluirá en el token.
   *
   * @type {any}
   */
  payload: any

  /**
   * Duración de la validez del token (por defecto es "2h").
   *
   * @type {string}
   * @default '2h'
   */
  duration?: string

  /**
   * Emisor del token.
   *
   * @type {string}
   * @default 'urn:example:issuer'
   */
  issuer?: string

  /**
   * Audiencia del token.
   *
   * @type {string}
   * @default 'urn:example:audience'
   */
  audience?: string
}

/**
 * Opciones para verificar la validez de un token JWT.
 */
export interface VerifyTokenOptions {
  /**
   * El token JWT que se va a verificar.
   *
   * @type {string}
   */
  token: string

  /**
   * Emisor del token que debe coincidir con el que se especificó al generarlo.
   *
   * @type {string}
   * @default 'urn:example:issuer'
   */
  issuer?: string

  /**
   * Audiencia del token que debe coincidir con la que se especificó al generarlo.
   *
   * @type {string}
   * @default 'urn:example:audience'
   */
  audience?: string
}

/**
 * Clase que gestiona la creación y validación de tokens JWT.
 * Utiliza el algoritmo HMAC (HS256) para firmar y verificar tokens.
 */
export class JWT {
  private static _instance: JWT

  /**
   * Constructor privado para inicializar la instancia con el secreto.
   *
   * @param {Uint8Array} secret - El secreto utilizado para firmar y verificar los tokens.
   */
  private constructor(private readonly secret: Uint8Array) {}

  /**
   * Obtiene la instancia única de la clase JWT.
   * Si aún no existe, se crea con el secreto de entorno configurado.
   *
   * @returns {JWT} La instancia de la clase JWT.
   */
  public static instance(): JWT {
    if (!this._instance) {
      const secret = envs.JWT_SECRET
      this._instance = new JWT(new TextEncoder().encode(secret))
    }
    return this._instance
  }

  /**
   * Genera un token JWT firmado con los datos proporcionados.
   *
   * @param {GenerateTokenOptions} opts - Opciones para generar el token (payload, duración, emisor, audiencia).
   * @returns {Promise<string>} El token generado.
   *
   * @throws {InternalServerErrorException} Si ocurre un error al generar el token.
   */
  public async generateToken(opts: GenerateTokenOptions) {
    const {
      payload,
      duration = '2h',
      issuer = 'urn:example:issuer',
      audience = 'urn:example:audience',
    } = opts

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' }) // Algoritmo de encriptación
      .setIssuedAt() // Fecha de emisión del token
      .setIssuer(issuer) // Emisor
      .setAudience(audience) // Audiencia
      .setExpirationTime(duration) // Fecha de expiración del token
      .sign(this.secret)
      .catch(() => {
        throw new InternalServerErrorException('Error generating token')
      })
    return token
  }

  /**
   * Verifica la validez de un token JWT y devuelve su payload si es válido.
   *
   * @param {VerifyTokenOptions} opts - Opciones para verificar el token (token, emisor, audiencia).
   * @returns {Promise<T | undefined>} El payload del token si es válido, o `undefined` si no lo es.
   *
   * @template T - Tipo de los datos esperados en el payload.
   */
  public async verifyToken<T>(
    opts: VerifyTokenOptions
  ): Promise<T | undefined> {
    const {
      token,
      issuer = 'urn:example:issuer',
      audience = 'urn:example:audience',
    } = opts

    try {
      const { payload } = await jwtVerify(token, this.secret, {
        issuer,
        audience,
      })
      return payload as T
    } catch (error) {
      return undefined
    }
  }
}
