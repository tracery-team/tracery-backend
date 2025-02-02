import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from 'src/data/user.entity'
import { applySearch, levenshtein } from 'src/levenshtein'
import { PAGE_SIZE } from 'src/constants'
import { plainToInstance } from 'class-transformer'
import { UserDto } from 'src/data/user.dto'

/**
 * Service responsible for handling user-related business logic.
 *
 * It includes methods for retrieving users, searching for friends with fuzzy search,
 * and adding or removing friends. The service interacts with the database through
 * TypeORM to perform CRUD operations on `UserEntity`.
 *
 * @service UserService
 */
@Injectable()
export class UserService {
  /**
   * Creates an instance of `UserService`.
   *
   * This constructor injects the `userRepository` used to manage user data.
   * It enables operations such as retrieving user information and manipulating user records.
   *
   * @param {Repository<UserEntity>} userRepository - Repository for managing user data.
   */
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find({
      relations: ['friends', 'events'],
    })
    return plainToInstance(UserDto, users, { excludeExtraneousValues: true })
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['friends', 'events'],
    })

    return plainToInstance(UserDto, user, { excludeExtraneousValues: true })
  }

  /**
   * Searches for friends based on a search term, with pagination support.
   *
   * This method filters users by their `nickanme` and `email` using the Levenshtein distance algorithm.
   * It returns paginated results, with up to PAGE_SIZE users per page.
   * If no search term is provided, it returns all users for the specified page.
   *
   * @param {number} page - The page number for pagination (default is 1).
   * @param {string} search - The search term to filter users by nickname or email (optional).
   * @returns {Promise<UserEntity[]} - A paginated list of `UserEntity` objects that match the search criteria.
   */
  async searchFriends(page: number, search?: string) {
    const skip = (page - 1) * PAGE_SIZE

    const users = await this.userRepository.find()

    if (!search) {
      return users.slice(skip, skip + PAGE_SIZE)
    }

    const filteredUsers = applySearch(users, user => {
      const distanceNickaname = levenshtein(
        search.toLowerCase(),
        user.nickname.toLowerCase(),
      )
      const distanceEmail = levenshtein(
        search.toLowerCase(),
        user.email.toLowerCase(),
      )
      const minDistance = Math.min(distanceNickaname, distanceEmail)
      return minDistance
    })

    const paginatedUsers = filteredUsers.slice(skip, skip + PAGE_SIZE)

    return paginatedUsers
  }

  /**
   * Adds a friend to a user's friend list.
   *
   * This method attempts to add a friend by associating the 'friendId' with the
   * `userId`'s friend list. It checks if both users exist in the database and
   * adds the friend to the user's list if valid. The changes are saved to the database.
   *
   * @param {number} userId - The ID of the user who is adding a friend.
   * @param {number} friendId - The ID of the user being added as a friend.
   * @returns {Promise<boolean>} - `true` if the friend was sucessfully added, `false` otherwise
   */
  async addFriend(userId: number, friendId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    })
    const friend = await this.userRepository.findOne({
      where: { id: friendId },
    })

    if (!user || !friend) {
      return false
    }

    user.friends.push(friend)
    await this.userRepository.save(user)

    return true
  }

  /**
   * Removes a friend from a user's friend list.
   *
   * This method attemps to remove a friend by dissociating the `friendId` from the
   * `userId`'s friend list of friends. It checks if both users exist in the database and
   * removes the friend from the user's list if valid. The changes are saved to the database.
   *
   * @param {number} userId - The ID of the user who is removing a friend.
   * @param {number} friendId - The ID of the user being removed as a friend.
   * @returns {Promise<boolean>} - `true` if the friend was successfully removed, `false` otherwise
   */
  async removeFriend(userId: number, friendId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    })
    const friend = await this.userRepository.findOne({
      where: { id: friendId },
    })

    if (!user || !friend) {
      return false
    }

    user.friends = user.friends.filter(f => f.id !== friendId)
    await this.userRepository.save(user)

    return true
  }
}
