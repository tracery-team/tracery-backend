import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from 'src/data/user.entity'
import { applySearch, levenshtein } from 'src/levenshtein'
import { PAGE_SIZE } from 'src/constants'
import { plainToInstance } from 'class-transformer'
import { UserDto } from 'src/data/user.dto'

@Injectable()
export class UserService {
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
