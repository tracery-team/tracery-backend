import {
  Controller,
  Get,
  NotFoundException,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard, AuthorizedRequest } from '../auth/auth.guard'
import { ProfileService } from './profile.service'

/**
 * Controller for handling user profile-related requests.
 *
 * This controller is responsible for managing HTTP requests related to user profiles,
 * such as retrieving the profile information of the authenticated user. It uses the
 * `ProfileService` to fetch user data and is protected by the `AuthGuard` to ensure
 * that only authenticated users can access the profile information.
 *
 * @controller ProfileController
 */
@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  /**
   * Retrieves the profile information of the authenticated user.
   *
   * This method fetches the authenticated user's profile using their `userId`
   * (extracted from the token), and returns it. If no user is found, a `NotFoundException`
   * is thrown.
   *
   * @param {AuthorizedRequest} request - The request object containing the authenticated user's token.
   * @returns {Promise<UserEntity>} - The user's profile data.
   * @throws {NotFoundException} - If the user does not exist in the database.
   */
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
