import { InternalServerErrorException } from '@domain/errors'
import { jwtVerify, SignJWT } from 'jose'

interface GenerateTokenOptions {
  payload: any
  duration?: string
  issuer?: string
  audience?: string
}

interface VerifyTokenOptions {
  token: string
  issuer?: string
  audience?: string
}

export class JWT {
  private static _instance: JWT

  private constructor(private readonly secret: Uint8Array) {}

  public static create(secret: string): JWT {
    if (!this._instance)
      this._instance = new JWT(new TextEncoder().encode(secret))
    return this._instance
  }

  public static instance(): JWT {
    if (!this._instance) {
      throw new Error('JWT instance not initialized')
    }
    return this._instance
  }

  public async generateToken(opts: GenerateTokenOptions) {
    const {
      payload,
      duration = '2h',
      issuer = 'urn:example:issuer',
      audience = 'urn:example:audience',
    } = opts

    const token = await new SignJWT(payload)
      // Algoritmo de encriptación
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      // Fecha de emisión del token
      .setIssuedAt()
      .setIssuer(issuer)
      .setAudience(audience)
      // Fecha de expiración del token
      .setExpirationTime(duration)
      .sign(this.secret)
      .catch(() => {
        throw new InternalServerErrorException('Error generating token')
      })
    return token
  }

  public async verifyToken<T>(opts: VerifyTokenOptions): Promise<T | null> {
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
      return null
    }
  }
}
