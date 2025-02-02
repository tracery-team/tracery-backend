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
} from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard, AuthorizedRequest } from '../auth/auth.guard'

/**
 * Controller responsible for handling user-related operations.
 *
 * It provides endpoints for managing friends, including adding, removing, and searching for friends.
 * Each of these actions is protected by authentication, ensuring only authorized users can modify their friends list.
 *
 * @controller UserController
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint to search for friends.
   *
   * This method allows users to search for their friends by name or other criteria.
   * The results can be paginated using the `page` query parameter.
   *
   * @param {number} page - The page number for pagination (default is 1).
   * @param {string} [search] - The search term to filter friends (optional).
   * @returns {Promise<any>} - A list of friends matching the search criteria.
   */
  @Get('friends')
  async searchFriends(
    @Query('page') page: number = 1,
    @Query('search') search?: string,
  ) {
    return this.userService.searchFriends(page, search)
  }

  /**
   * Endpoint to add a friend.
   *
   * This method allows an authenticated user to add another user as a friend.
   * It requires authentication and the ID of the friend to be added.
   *
   * @param {AuthorizedRequest} request - The request object containing the
   * authenticated user's information.
   * @param {number} friendId - The ID of the user to be added as a friend.
   * @returns {Promise<any>} - Success message if the friend is added successfully.
   * @throws {BadRequestException} - If the friend could not be added.
   */
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

  /**
   * Endpoint to remove a friend.
   *
   * This method allows an authenticated user to remove a friend.
   * It requires authentication and the ID of the friend to be removed.
   *
   * @param {AuthorizedRequest} request The request object containing the
   * authenticated user's information.
   * @param {number} friendId - The ID of the friend to be removed.
   * @returns {Promise<any>} - Success message if the friend is removed successfully.
   * @throws {BadRequestException} - If the friend could not be removed.
   */
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
