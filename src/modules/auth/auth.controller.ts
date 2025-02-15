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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
