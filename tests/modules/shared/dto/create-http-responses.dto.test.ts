import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import 'reflect-metadata'

import { CreateHTTPResponseDto } from '@modules/shared/dtos'
import { HTTPMessages } from '@modules/shared/constants'
import { HTTPStatusCode } from '@modules/shared/enums/http'

describe('create-sorting.dto.test.ts', () => {
  const message = 'generic message'
  const data = {
    test: 'generic data',
  }

  it('should return a CreateHttpResponsesDto with 200', async () => {
    const createHttpResponseDto = CreateHTTPResponseDto.ok(message, data)
    expect(createHttpResponseDto).toBeInstanceOf(CreateHTTPResponseDto)
    expect(createHttpResponseDto).toMatchObject({
      message,
      data,
      statusCode: HTTPStatusCode.Ok,
      status: HTTPMessages.OK,
    })
  })

  it('should return a CreateHttpResponsesDto with 201', async () => {
    const createHttpResponseDto = CreateHTTPResponseDto.created(message, data)
    expect(createHttpResponseDto).toBeInstanceOf(CreateHTTPResponseDto)
    expect(createHttpResponseDto).toMatchObject({
      message,
      data,
      statusCode: HTTPStatusCode.Created,
      status: HTTPMessages.CREATED,
    })
  })

  it('should return a okCreateHttpResponsesDto with 202', async () => {
    const createHttpResponseDto = CreateHTTPResponseDto.accepted(message, data)
    expect(createHttpResponseDto).toBeInstanceOf(CreateHTTPResponseDto)
    expect(createHttpResponseDto).toMatchObject({
      message,
      data,
      statusCode: HTTPStatusCode.Accepted,
      status: HTTPMessages.ACCEPTED,
    })
  })

  it('should return a CreateHttpResponsesDto with 204', async () => {
    const createHttpResponseDto = CreateHTTPResponseDto.noContent()
    expect(createHttpResponseDto).toBeInstanceOf(CreateHTTPResponseDto)
    expect(createHttpResponseDto).toMatchObject({
      statusCode: HTTPStatusCode.NoContent,
      status: HTTPMessages.NO_CONTENT,
    })
  })

  it('should return a CreateHttpResponsesDto with 206', async () => {
    const createHttpResponseDto = CreateHTTPResponseDto.partialContent(
      message,
      data
    )
    expect(createHttpResponseDto).toBeInstanceOf(CreateHTTPResponseDto)
    expect(createHttpResponseDto).toMatchObject({
      message,
      data,
      statusCode: HTTPStatusCode.PartialContent,
      status: HTTPMessages.PARTIAL_CONTENT,
    })
  })
})
