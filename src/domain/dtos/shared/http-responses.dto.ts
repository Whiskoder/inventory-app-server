import { HTTPMessages } from '@domain/constants/http-messages'
import { HTTPStatusCode } from '@domain/enums/http'

type HTTPResponseData = { [key: string]: any }

export class HTTPResponseDto {
  private constructor(
    readonly statusCode: number,
    readonly status: string,
    readonly message?: string,
    readonly data?: HTTPResponseData
  ) {}

  public static ok(message?: string, data?: HTTPResponseData): HTTPResponseDto {
    return new HTTPResponseDto(
      HTTPStatusCode.Ok,
      HTTPMessages.OK,
      message,
      data
    )
  }

  public static created(
    message?: string,
    data?: HTTPResponseData
  ): HTTPResponseDto {
    return new HTTPResponseDto(
      HTTPStatusCode.Created,
      HTTPMessages.CREATED,
      message,
      data
    )
  }

  public static accepted(
    message?: string,
    data?: HTTPResponseData
  ): HTTPResponseDto {
    return new HTTPResponseDto(
      HTTPStatusCode.Accepted,
      HTTPMessages.ACCEPTED,
      message,
      data
    )
  }

  public static noContent(
    message?: string,
    data?: HTTPResponseData
  ): HTTPResponseDto {
    return new HTTPResponseDto(
      HTTPStatusCode.NoContent,
      HTTPMessages.NO_CONTENT,
      message,
      data
    )
  }

  public static partialContent(
    message?: string,
    data?: HTTPResponseData
  ): HTTPResponseDto {
    return new HTTPResponseDto(
      HTTPStatusCode.PartialContent,
      HTTPMessages.PARTIAL_CONTENT,
      message,
      data
    )
  }
}
