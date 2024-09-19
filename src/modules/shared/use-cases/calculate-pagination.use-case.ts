import { BadRequestException, NotFoundException } from '@core/errors'

export interface CalculatePaginationOpts {
  currentPage: number
  limit: number
  totalItems: number
  skip: number
}

export class CalculatePaginationUseCase {
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

  public static execute(opts: CalculatePaginationOpts) {
    const { currentPage, limit, totalItems, skip } = opts

    const constructor = CalculatePaginationUseCase

    const totalPages = Math.ceil(totalItems / limit)
    const nextPage = constructor.calculateNextPage(currentPage, totalPages)
    const previousPage = constructor.calculatePreviousPage(currentPage)

    if (!totalItems) throw new NotFoundException('No items found')
    if (totalItems < skip)
      throw new BadRequestException(
        `Page out of range, total pages: ${totalPages}`
      )

    return {
      totalPages,
      nextPage,
      previousPage,
      currentPage,
      totalItems,
      limit,
    }
  }
}
