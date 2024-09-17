import 'dotenv/config'
import { get } from 'env-var'

export const envs = {
  DB_HOST: get('DB_HOST').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
  DB_PASS: get('DB_PASS').required().asString(),
  DB_PORT: get('DB_PORT').required().asPortNumber(),
  DB_USER: get('DB_USER').required().asString(),
  MAILER_HOST: get('MAILER_HOST').required().asString(),
  MAILER_PASS: get('MAILER_PASS').required().asString(),
  MAILER_PORT: get('MAILER_PORT').required().asPortNumber(),
  MAILER_USER: get('MAILER_USER').required().asString(),
  NODE_ENV: get('NODE_ENV').required().asEnum(['development', 'production']),
  PORT: get('PORT').required().asPortNumber(),
  SEND_EMAIL: get('SEND_EMAIL').required().asBool(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),
}
