import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/data/user.entity'
import { QueryFailedError, Repository } from 'typeorm'

/**
 * Enum representing the possible statuses when trying to sign up a user.
 * @enum {string}
 */
export const enum SignupStatus {
  SUCCESS = 'success',
  DUPLICATE_ERR = 'duplicate-error',
  UNKNOWN_ERR = 'unknown-error',
}

type TokenJWT = string

/**
 * The AuthService is responsible for handling user authentication-related operations,
 * including user registration (sign up) and user login with JWT generation.
 *
 * @service AuthService
 */
@Injectable()
export class AuthService {
  constructor(
    /**
     * Injects the User repository to interact with the user data in the database.
     */
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    /**
     * Injects the JwtService to generate and verify JSON Web Tokens (JWT).
     */
    private jwtService: JwtService,
  ) {}

  /**
   * Signs up a new user by creating a new user record in the database.
   *
   * This method attempts to create a new user in the database using the provided user data.
   * If successful, it returns a success status. If the user already exists, it returns a
   * duplicate error status. Any other errors will return an unknown error status.
   *
   * @param userData - The user data to be used for registration.
   * @returns {Promise<SignupStatus>} - The result of the sign-up operation (success, duplicate error, or unknown error).
   */
  async signUp(userData: Partial<UserEntity>): Promise<SignupStatus> {
    try {
      const newUser = this.userRepository.create(userData)
      await this.userRepository.save(newUser)
      return SignupStatus.SUCCESS
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        return SignupStatus.DUPLICATE_ERR
      }
      return SignupStatus.UNKNOWN_ERR
    }
  }

  /**
   * Logs in a user by validating their credentials and generating a JWT token.
   *
   * This method checks whether a user exists with the provided login (email or nickname),
   * validates the user's password, and generates a JWT token if the credentials are correct.
   * If either the user is not found or the password is incorrect, `null` is returned.
   *
   * @param login - The user's email or nickname.
   * @param password - The user's password.
   * @returns {Promise<TokenJWT | null>} - The generated JWT token if login is successful, or null if authentication fails.
   */
  // returns JWT token
  async login(login: string, password: string): Promise<TokenJWT | null> {
    const user = await this.userRepository.findOne({
      where: [{ email: login }, { nickname: login }],
    })
    if (user === null) {
      return null
    }
    const verdict = await user.validatePassword(password)
    if (!verdict) {
      return null
    }
    const payload = {
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
    }
    const token = await this.jwtService.signAsync(payload)
    return token
  }
}
