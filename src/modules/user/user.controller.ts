import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('friends')
  async searchFriends(
    @Query('page') page: number = 1,
    @Query('search') search?: string,
  ) {
    return this.userService.searchFriends(page, search)
  }

  @Post('add-friend')
  @UseGuards(AuthGuard)
  async addFriend(@Request() request, @Body() body: { friendId: number }) {
    const userId = request.user.sub
    const { friendId } = body

    const result = await this.userService.addFriend(userId, friendId)

    if (result) {
      return { message: 'Friend added successfully' }
    } else {
      throw new Error('Could not add friend')
    }
  }

  @Delete('remove-friend')
  @UseGuards(AuthGuard)
  async removeFriend(@Request() request, @Body() body: { friendId: number }) {
    const userId = request.user.sub
    const { friendId } = body

    const result = await this.userService.removeFriend(userId, friendId)

    if (result) {
      return { message: 'Friend removed successfully' }
    } else {
      throw new Error('Could not remove friend')
    }
  }
}
