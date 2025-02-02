import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

const jwtSecret = process.env.JWT_SECRET

/**
 * Represents the structure of a parsed JWT token payload.
 *
 * This type is used to define the expected format of the JWT token's payload after decoding.
 * It includes the user's `sub` (subject), `nickname`, and `email`.
 */
export type ParsedToken = {
  sub: number
  nickname: string
  email: string
}

/**
 * Type guard to check if the given payload is a valid parsed JWT token.
 *
 * @param payload - The JWT token payload.
 * @returns {boolean} - Returns true if the payload matches the structure of a valid `ParsedToken`.
 */
const isParsedToken = (payload: any): payload is ParsedToken => {
  return (
    payload !== null &&
    payload !== undefined &&
    typeof payload === 'object' &&
    typeof payload.sub === 'number' &&
    typeof payload.nickname === 'string' &&
    typeof payload.email === 'string'
  )
}

/**
 * Extends the Express `Request` object to include the parsed JWT token.
 *
 * This type is used to represent a request that contains a valid parsed JWT token.
 */
export type AuthorizedRequest = Request & {
  parsedToken: ParsedToken
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Validates if a request has a valid JWT token in its Authorization header.
   *
   * This method checks if the request contains a valid token. It verifies the token using the
   * `JwtService` and extracts the payload. If the token is invalid or missing, it throws
   * an `UnauthorizedException`. If the token is valid, it attaches the parsed token to the request.
   *
   * @param {ExecutionContext} context - The execution context which contains the request.
   * @returns {Promise<boolean>} - Returns `true` if the token is valid and the request can proceed.
   * @throws {UnauthorizedException} - Thrown if the token is missing or invalid.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      })
      if (!isParsedToken(payload)) {
        throw new Error('Wrong structure of JWT token')
      }
      request.parsedToken = payload
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  /**
   * Extracts the JWT token from the Authorization header of the request.
   *
   * This method looks for the Authorization header and retrieves the token if it follows the
   * Bearer scheme. If no token is found or the header does not follow the expected format,
   * it returns `undefined`.
   *
   * @param {Request} request - The incoming request object.
   * @returns {string | undefined} - The extracted JWT token or `undefined` if not found.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
