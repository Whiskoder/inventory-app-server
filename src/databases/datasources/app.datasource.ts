import { DataSource } from 'typeorm'
import { envs } from '@config/plugins'
import { join } from 'node:path'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASS,
  database: envs.DB_NAME,
  synchronize: envs.NODE_ENV === 'development' ? true : false,
  logging: envs.NODE_ENV === 'development' ? false : false,
  entities: [join(__dirname, '/src/databases/models', '*.model.ts')],
  migrations: [join(__dirname, '/src/databases/migrations', '*.ts')],
  subscribers: [],
})
