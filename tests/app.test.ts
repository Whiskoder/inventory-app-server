import { Server } from '@core/server'
import { envs } from '@config/plugins'
import { AppDataSource } from '@core/datasources'

jest.mock('@core/server')
jest.mock('@core/datasources/app.datasource')

describe('App', () => {
  test('should call server with arguments and start', async () => {
    await import('@/app')
    expect(Server).toHaveBeenCalledTimes(1)
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      routes: expect.any(Function),
    })

    const datasourceSpy = jest.spyOn(AppDataSource, 'initialize')
    expect(datasourceSpy).toHaveBeenCalledTimes(1)

    expect(Server.prototype.start).toHaveBeenCalledWith()
  })
})
