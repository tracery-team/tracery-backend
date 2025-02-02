import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

/**
 * The entry point of the application.
 *
 * This function initializes and configures the NestJS application. It sets up global
 * pipes for validation and transformation, which ensure that request payloads are
 * validated and transformed into the appropriate data types. It also listens on the
 * port specified in the environment variable or defaults to port 3000.
 *
 * @async
 * @function bootstrap
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
