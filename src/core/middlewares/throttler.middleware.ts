import { rateLimit } from 'express-rate-limit'
import { TooManyRequestsException } from '@core/errors'

export class ThrottlerMiddleware {
  // Default to 1000 request per 15 minute
  public static limit = (
    windowMs: number = 1000 * 60 * 15,
    limit: number = 1000
  ) => {
    return rateLimit({
      windowMs,
      limit,
      handler: () => {
        throw new TooManyRequestsException()
      },
    })
  }
}
