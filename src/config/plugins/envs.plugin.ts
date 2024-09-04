import 'dotenv/config'
import { get } from 'env-var'

export const envs = {
  DB_HOST: get('DB_HOST').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
  DB_PASS: get('DB_PASS').required().asString(),
  DB_PORT: get('DB_PORT').required().asPortNumber(),
  DB_USER: get('DB_USER').required().asString(),
  NODE_ENV: get('NODE_ENV').required().asEnum(['development', 'production']),
  PORT: get('PORT').required().asPortNumber(),
}
