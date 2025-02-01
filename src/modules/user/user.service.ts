import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from 'src/data/user.entity'
import { levenshtein } from 'src/levenshtein'
import { PAGE_SIZE } from 'src/constants'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async searchFriends(page: number, search?: string): Promise<UserEntity[]> {
    const skip = (page - 1) * PAGE_SIZE

    const users = await this.userRepository.find()

    if (!search) {
      return users.slice(skip, skip + PAGE_SIZE)
    }

    const filteredUsers = users
      .map(user => {
        const userEntity = { ...user }
        const nicknameDistance = levenshtein(
          search.toLowerCase(),
          user.nickname.toLowerCase(),
        )

        const userWithDistance = {
          ...userEntity,
          distance: nicknameDistance,
        }

        return userWithDistance
      })
      .filter(user => user.distance <= 2)
      .sort((a, b) => a.distance - b.distance)

    const paginatedUsers = filteredUsers.slice(skip, skip + PAGE_SIZE)

    return paginatedUsers
  }

  async addFriend(userId: number, friendId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    })
    const friend = await this.userRepository.findOne({
      where: { id: friendId },
    })

    if (!user || !friend) {
      throw new Error('User or Friend not found')
    }

    user.friends.push(friend)
    await this.userRepository.save(user)
  }

  async removeFriend(userId: number, friendId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    })
    const friend = await this.userRepository.findOne({
      where: { id: friendId },
    })

    if (!user || !friend) {
      throw new Error('User or Friend not found')
    }

    user.friends = user.friends.filter(f => f.id !== friendId)
    await this.userRepository.save(user)
  }
}
