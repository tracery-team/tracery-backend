import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

const jwtSecret = process.env.JWT_SECRET

export type ParsedToken = {
  sub: number
  nickname: string
  email: string
}

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

export type AuthorizedRequest = Request & {
  parsedToken: ParsedToken
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

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

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
