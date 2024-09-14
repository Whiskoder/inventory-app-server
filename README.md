# Los pepes Backend

grupoDlamaña

# Instalaciones recomendadas

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - Para manejar contenedores de Docker como base de datos
- [Postman](https://www.postman.com/) - Para pruebas de API y endpoints
- [TablePlus](https://tableplus.com/) - Visualización gráfica de bases de datos
- [Nvm](https://github.com/coreybutler/nvm-windows) - Control de versiones de Node.js

# Extensiones recomendadas

- [Better comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) - Mejora la visualización de los comentarios

# Instrucciones

- Instalar dependencias

```bash
	npm install
```

Copiar el archivo `.env.template` y renombrarlo a `.env`
Modificar las variables de entorno según corresponda

- Iniciar la base de datos

```bash
	npm run docker:dev
```

- Iniciar la aplicación

```bash
	npm run dev
```

- Iniciar la aplicación en modo producción

```bash
	npm run build && npm start
```

# Dependencias de desarrollo

- [@types/bcrypt](https://www.npmjs.com/package/@types/bcrypt) - Tipado de bcryptjs para typescript
- [@types/cors](https://www.npmjs.com/package/@types/cors) - Tipado de cors para typescript
- [@types/express](https://www.npmjs.com/package/@types/express) - Tipado de Express para typescript
- [@types/http-errors](https://www.npmjs.com/package/@types/http-errors) - Tipado de http-erros para typescript
- [@types/jest](https://www.npmjs.com/package/@types/jest) - Tipado de jest para typescript
- [@types/node](https://www.npmjs.com/package/@types/node) - Tipado de Node.js para typescript
- [@types/nodemailer](https://www.npmjs.com/package/@types/nodemailer) - Tipado de nodemailer para typescript
- [@types/supertest](https://www.npmjs.com/package/@types/supertest) - Tipado de supertest para typescript
- [jest](https://jestjs.io/) - Librearía para testing
- [rimraf](https://www.npmjs.com/package/rimraf) - Elimina archivos y directorios
- [supertest](https://www.npmjs.com/package/supertest) - Pruebas de integración
- [ts-jest](https://www.npmjs.com/package/ts-jest) - Ayuda a la compatibilidad de jest con typescript
- [ts-node-dev](https://www.npmjs.com/package/ts-node-dev) - Reinicia la aplicación automáticamente al detectar cambios
- [tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths) - Evita las rutas relativas en typescript
- [typescript](https://www.npmjs.com/package/typescript) - Compilador de typescript

# Dependencias de producción

- [bcryptjs](https://www.npmjs.com/package/bcrypt) - Librería para encriptar información, se usa para evitar guardar las contraseñas de los usuarios de manera plana
- [class-transformer](https://www.npmjs.com/package/class-transformer) - Transforma los datos enviadas en las peticiones
- [class-validator](https://www.npmjs.com/package/class-validator) - Valida que los datos enviados en las peticiones sean los solicitados
- [cors](https://www.npmjs.com/package/cors) - Middleware para habilitar CORS
- [dotenv](https://www.npmjs.com/package/dotenv) - Carga variables de entorno desde un archivo .env
- [env-var](https://www.npmjs.com/package/env-var) - Valida y verifica las variables de entorno
- [express](https://www.npmjs.com/package/express) - Proporciona métodos y propiedades para manejar las solicitudes HTTP entrantes y generar respuestas.
- [http-errors](https://www.npmjs.com/package/http-errors) - Facilita la creación de errores HTTP de manera más dinamica
- [jose](https://www.npmjs.com/package/jose) - Librería con funciones para JWT
- [nodemailer](https://www.npmjs.com/package/nodemailer) - Cliente para conectarse a servicios SMTP y envío de correos
- [pg](https://www.npmjs.com/package/pg) - Cliente de PostgreSQL para Node.js
- [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) - Proporciona metadatos de diseño para clases, propiedades y métodos
- [typeorm](https://www.npmjs.com/package/typeorm) - ORM para Node.js

# Explicación de los scripts

- `dev`: `tsnd --respawn --clear src/app.ts`

  - `-r tsconfig-paths/register` : Registra los paths definidos en el archivo tsconfig.json
  - `--respawn` : Reinicia la aplicación automáticamente al detectar cambios
  - `--clear` : Limpia la consola al reiniciar la aplicación
  - `src/app.ts` : Archivo de entrada de la aplicación

- `build`: `rimraf ./dist && tsc`

  - `rimraf ./dist` : Elimina el directorio dist
  - `tsc` : Transpila el código typescript a javascript

- `start`: `node dist/app.js`

  - `node dist/app.js` : Ejecuta el archivo ubicado en dist/app.js

- `docker:dev`: `docker-compose -f docker-compose.dev.yml up -d`

  - `docker-compose`: Herramienta para definir y ejecutar aplicaciones Docker
  - `-f docker-compose.dev.yaml` : Define el archivo de configuración de docker-compose
  - `--env-file .env` : Define el archivo de variables de entorno
  - `up -d` : Levanta los contenedores en segundo plano

- `test`: `jest`

  - `jest` : Ejecuta las pruebas

- `test:watch`: `jest --watch`

  - `jest --watch` : Ejecuta las pruebas en modo watch

- `test:coverage`: `jest --coverage`
  - `jest --coverage` : Ejecuta las pruebas y muestra el coverage
