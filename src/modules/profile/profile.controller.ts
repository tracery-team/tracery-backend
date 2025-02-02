import { Controller, Get, NotFoundException, Request, UseGuards } from '@nestjs/common'
import { AuthGuard, AuthorizedRequest } from '../auth/auth.guard'
import {ProfileService} from './profile.service'

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {

  constructor (
    private profileService: ProfileService,
  ) {}

  @Get('/')
  async mainInfo(@Request() request: AuthorizedRequest) {
    const { sub } = request.parsedToken
    const user = await this.profileService.getUserInfo(sub)
    if (user === null) {
      throw new NotFoundException()
    }
    return user
  }

}
