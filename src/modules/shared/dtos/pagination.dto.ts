import { plainToInstance, Type } from 'class-transformer'
import { IsInt, IsPositive, validateOrReject } from 'class-validator'

interface Options {
  currentPage: number
  limit: number
  totalItems: number
}

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page!: number

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit!: number

  skip!: number

  private static calculateNextPage(
    currentPage: number,
    totalPages: number
  ): number | undefined {
    const nextPage = currentPage + 1
    return nextPage <= totalPages ? nextPage : undefined
  }

  private static calculatePreviousPage(
    currentPage: number
  ): number | undefined {
    return currentPage > 1 ? currentPage - 1 : undefined
  }

  public static calculate(opts: Options) {
    const { currentPage, limit, totalItems } = opts
    const totalPages = Math.ceil(totalItems / limit)
    const nextPage = this.calculateNextPage(currentPage, totalPages)
    const previousPage = this.calculatePreviousPage(currentPage)

    return {
      totalPages,
      nextPage,
      previousPage,
      currentPage,
      totalItems,
      limit,
    }
  }

  public static async create(obj: {
    [key: string]: any
  }): Promise<PaginationDto> {
    const { page = 1, limit = 10 } = obj || {}

    const dto = plainToInstance(PaginationDto, { page, limit })
    await validateOrReject(dto)

    dto.skip = (dto.page - 1) * dto.limit

    return dto
  }
}
