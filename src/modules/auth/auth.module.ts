import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from 'src/data/user.entity'
import { JwtModule } from '@nestjs/jwt'

/**
 * The AuthModule is responsible for handling user authentication and authorization.
 *
 * This module integrates the authentication service and controller for managing user
 * login and registration, as well as providing JWT token generation and validation.
 * It also manages interactions with the `UserEntity` using TypeORM to access user data.
 *
 * @module AuthModule
 */
@Module({
  imports: [
    /**
     * Registers the `UserEntity` with TypeOrm to enable database operations related to users.
     */
    TypeOrmModule.forFeature([UserEntity]),

    /**
     * Configures the JwtModule to handle JSON Web Tokens (JWT).
     *
     * This module is responsible for signing and verifying JWTs used for user authentication.
     * The JWT secret is fetched from the environment variables (`process.env.JWT_SECRET`), and
     * additional sign options (such as expiration) can be added later.
     */
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        // TODO: add expiration later
        // expiresIn:
      },
    }),
  ],
  /**
   * AuthController handles incoming HTTP requests related to authentication (e.g., login, sign-up).
   */
  controllers: [AuthController],
  /**
   * AuthService provides the core authentication logic, such as user login, sign-up,
   * and JWT token generation.
   */
  providers: [AuthService],
})
export class AuthModule {}
