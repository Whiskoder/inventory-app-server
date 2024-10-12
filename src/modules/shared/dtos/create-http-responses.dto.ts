import { HTTPMessages } from '@/modules/shared/constants/http-messages'
import { HTTPStatusCode } from '@/modules/shared/enums/http'

type HTTPResponseData = { [key: string]: any }

export class CreateHTTPResponseDto {
  private constructor(
    readonly statusCode: number,
    readonly status: string,
    readonly message?: string,
    readonly data?: HTTPResponseData
  ) {}

  public static ok(
    message?: string,
    data?: HTTPResponseData
  ): CreateHTTPResponseDto {
    return new CreateHTTPResponseDto(
      HTTPStatusCode.Ok,
      HTTPMessages.OK,
      message,
      data
    )
  }

  public static created(
    message?: string,
    data?: HTTPResponseData
  ): CreateHTTPResponseDto {
    return new CreateHTTPResponseDto(
      HTTPStatusCode.Created,
      HTTPMessages.CREATED,
      message,
      data
    )
  }

  public static accepted(
    message?: string,
    data?: HTTPResponseData
  ): CreateHTTPResponseDto {
    return new CreateHTTPResponseDto(
      HTTPStatusCode.Accepted,
      HTTPMessages.ACCEPTED,
      message,
      data
    )
  }

  public static noContent(): CreateHTTPResponseDto {
    return new CreateHTTPResponseDto(
      HTTPStatusCode.NoContent,
      HTTPMessages.NO_CONTENT
    )
  }

  public static partialContent(
    message?: string,
    data?: HTTPResponseData
  ): CreateHTTPResponseDto {
    return new CreateHTTPResponseDto(
      HTTPStatusCode.PartialContent,
      HTTPMessages.PARTIAL_CONTENT,
      message,
      data
    )
  }
}
