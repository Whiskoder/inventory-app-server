import { CalculatePaginationUseCase } from '@/modules/shared/use-cases'

describe('calculate-pagination.use-case.test.ts', () => {
  it('should return correct values', () => {
    const totalItems = 100
    const currentPage = 2
    const limit = 10

    const pagination = CalculatePaginationUseCase.execute({
      totalItems,
      currentPage,
      limit,
    })

    expect(pagination).toMatchObject({
      nextPage: 3,
      previousPage: 1,
      currentPage,
      limit,
      totalItems,
      totalPages: 10,
    })
  })

  it('should set nextPage to undefined', () => {
    const totalItems = 100
    const currentPage = 10
    const limit = 10

    const pagination = CalculatePaginationUseCase.execute({
      totalItems,
      currentPage,
      limit,
    })

    expect(pagination).toMatchObject({
      nextPage: undefined,
      previousPage: 9,
      currentPage,
      limit,
      totalItems,
      totalPages: 10,
    })
  })

  it('should set previusPage to undefined', () => {
    const totalItems = 100
    const currentPage = 1
    const limit = 10

    const pagination = CalculatePaginationUseCase.execute({
      totalItems: 100,
      currentPage: 1,
      limit: 10,
    })

    expect(pagination).toMatchObject({
      nextPage: 2,
      previousPage: undefined,
      currentPage,
      limit,
      totalItems,
      totalPages: 10,
    })
  })

  it('should throw a not found exception', () => {
    try {
      CalculatePaginationUseCase.execute({
        totalItems: 0,
        currentPage: 1,
        limit: 10,
      })
    } catch (error: any) {
      expect(error.statusCode).toBe(404)
    }
  })

  it('should throw a bad request exception', () => {
    try {
      CalculatePaginationUseCase.execute({
        totalItems: 1,
        currentPage: 10,
        limit: 1,
      })
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })
})
