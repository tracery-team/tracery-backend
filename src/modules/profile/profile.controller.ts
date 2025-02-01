import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { AuthGuard, AuthorizedRequest } from '../auth/auth.guard'

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  // TODO: only for testing
  @Get('jwt')
  async jwt(@Request() request: AuthorizedRequest) {
    return request.parsedToken
  }
}
