import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard, AuthorizedRequest } from '../auth/auth.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info/:id')
  async getUser(@Param('id') id: number) {
    const user = await this.userService.findOne(id)
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

  @Get('friends')
  async searchFriends(
    @Query('page') page: number = 1,
    @Query('search') search?: string,
  ) {
    return this.userService.searchFriends(page, search)
  }

  @Post('add-friend')
  @UseGuards(AuthGuard)
  async addFriend(
    @Request() request: AuthorizedRequest,
    @Body('friendId') friendId: number,
  ) {
    const userId = request.parsedToken.sub

    const result =
      (await this.userService.addFriend(userId, friendId)) &&
      (await this.userService.addFriend(friendId, userId))

    if (result) {
      return { message: 'Friend added successfully' }
    } else {
      throw new BadRequestException('Could not add friend')
    }
  }

  @Delete('remove-friend')
  @UseGuards(AuthGuard)
  async removeFriend(
    @Request() request: AuthorizedRequest,
    @Body('friendId') friendId: number,
  ) {
    const userId = request.parsedToken.sub

    const result =
      (await this.userService.removeFriend(userId, friendId)) &&
      (await this.userService.removeFriend(friendId, userId))

    if (result) {
      return { message: 'Friend removed successfully' }
    } else {
      throw new BadRequestException('Could not remove friend')
    }
  }
}
