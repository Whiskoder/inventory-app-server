import { BadRequestException, NotFoundException } from '@core/errors'

export interface CalculatePaginationOpts {
  skip: number
  limit: number
  totalItems: number
}

export const CalculatePaginationUseCase = (opts: CalculatePaginationOpts) => {
  const { skip, limit, totalItems } = opts

  if (!totalItems) throw new NotFoundException('No items found')
  if (totalItems < skip)
    throw new BadRequestException(
      `Offset out of range, total items: ${totalItems}`
    )

  const calculateNextOffset = () => {
    return skip + limit >= totalItems
      ? totalItems - limit >= 0
        ? totalItems - limit
        : 0
      : skip + limit
  }

  const calculatePreviousOffset = () => {
    return skip - limit <= 0 ? 0 : skip - limit
  }

  const next = calculateNextOffset()
  const previous = calculatePreviousOffset()

  return {
    limit,
    next,
    previous,
    totalItems,
  }
}
