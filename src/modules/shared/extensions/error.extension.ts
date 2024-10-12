export interface IHTTPError extends Error {
  statusCode: number
  detail?: string
  code?: string
}
