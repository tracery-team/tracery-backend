import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { UserEntity } from 'src/data/user.entity'
import { Repository } from 'typeorm'

/**
 * Service responsible for managing user profile-related operations.
 *
 * This service provides functionality to retrieve user profile information,
 * including the user's basic details and friends list. It interacts with the
 * database through the `UserEntity` repository and returns the user information.
 *
 * @service ProfileService
 */
@Injectable()
export class ProfileService {
  /**
   * Creates an instance of `ProfileService`.
   *
   * This constructor injects the `userRepository` used to manage user profile data.
   * It allows retrieving user details and performing other profile-related operations.
   *
   * @param {Repository<UserEntity>} userRepository - Repository for managing user data.
   */
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Retrieves the profile information of a user by their ID.
   *
   * This method fetches the user data from the database and returns it as a `UserEntity` object.
   *
   * @param {number} userId - The ID of the user whose profile is to be fetched.
   * @returns {Promise<UserEntity | null>} - The user profile data, or `null` if the user doesn't exist.
   */
  async getUserInfo(userId: number): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'], // TODO: add events later
    })
    return plainToInstance(UserEntity, user)
  }
}
