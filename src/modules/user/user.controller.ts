import { Controller, Get, Query, Post, Body, Delete } from '@nestjs/common'
import { UserService } from './user.service'

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
  async addFriend(@Body() body: { userId: number; friendId: number }) {
    const { userId, friendId } = body
    await this.userService.addFriend(userId, friendId)
    return { message: 'Friend added successfully' }
  }

  @Delete('remove-friend')
  async removeFriend(@Body() body: { userId: number; friendId: number }) {
    const { userId, friendId } = body
    await this.userService.removeFriend(userId, friendId)
    return { message: 'Friend removed successfully' }
  }
}
