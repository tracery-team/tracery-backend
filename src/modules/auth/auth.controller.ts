import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService, SignupStatus } from './auth.service'
import { SignUpDto } from './signup.dto'
import { LoginDto } from './login.dto'

/**
 * The controller responsible for handling authentication-related requests.
 *
 * This controller provides routes for user login and user sign-up. It integrates
 * with the `AuthService` to manage the login and registration process.
 *
 * @controller AuthController
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user login requests.
   *
   * This method accepts a login request with a username and password,
   * attempts to authenticate the user, and returns a JWT if successful.
   * If authentication fails, an UnauthorizedException is thrown.
   *
   * @param {LoginDto} loginDto - The login credentials (login and password).
   * @returns {Promise<{ access_token: string }>} - Returns an object containing the JWT.
   * @throws {UnauthorizedException} - Thrown if authentication fails.
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { login, password } = loginDto
    const maybeJwt = await this.authService.login(login, password)
    if (maybeJwt === null) {
      throw new UnauthorizedException()
    }
    return {
      access_token: maybeJwt,
    }
  }

  /**
   * Handles user sign-up requests.
   *
   * This method accepts sign-up credentials, attempts to register a new user,
   * and returns a success message if the registration is successful.
   * If the username or email already exists, a BadRequestException is thrown.
   * If an unexpected error occurs, an InternalServerErrorException is thrown.
   *
   * @param {SignUpDto} signUpDto - The sign-up credentials (username, email, password).
   * @returns {Promise<{ message: string }>} - Returns a success message after registration.
   * @throws {BadRequestException} - Thrown if the username or email is already taken.
   * @throws {InternalServerErrorException} - Thrown if an error occurs during registration.
   */
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const status = await this.authService.signUp(signUpDto)
    switch (status) {
      case SignupStatus.SUCCESS:
        return {
          message: 'successfully registered a new user',
        }
      case SignupStatus.DUPLICATE_ERR:
        throw new BadRequestException(
          'user with such username or email already exists',
        )
      default:
        throw new InternalServerErrorException('failed to register a new user')
    }
  }
}
