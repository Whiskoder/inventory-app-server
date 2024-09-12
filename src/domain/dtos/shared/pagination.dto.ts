interface Options {
  currentPage: number
  limit: number
  totalItems: number
}

export class PaginationDto {
  public readonly currentPage: number
  public readonly limit: number
  public readonly nextPage?: number
  public readonly previousPage?: number
  public readonly totalPages: number

  constructor(opts: Options) {
    const { currentPage, limit, totalItems } = opts

    this.currentPage = currentPage
    this.limit = limit
    this.totalPages = Math.ceil(totalItems / limit)
    this.nextPage = this.calculateNextPage()
    this.previousPage = this.calculatePreviousPage()
  }

  private calculateNextPage(): number | undefined {
    const nextPage = this.currentPage + 1
    return nextPage <= this.totalPages ? nextPage : undefined
  }

  private calculatePreviousPage(): number | undefined {
    return this.currentPage > 1 ? this.currentPage - 1 : undefined
  }
}
