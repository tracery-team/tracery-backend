import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/data/user.entity'
import { QueryFailedError, Repository } from 'typeorm'

export const enum SignupStatus {
  SUCCESS = 'success',
  DUPLICATE_ERR = 'duplicate-error',
  UNKNOWN_ERR = 'unknown-error',
}

type TokenJWT = string

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signUp(userData: Omit<UserEntity, 'id'>): Promise<SignupStatus> {
    try {
      const newUser = this.userRepository.create(userData)
      await this.userRepository.save(newUser)
      return SignupStatus.SUCCESS
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        return SignupStatus.DUPLICATE_ERR
      }
      return SignupStatus.UNKNOWN_ERR
    }
  }

  // returns JWT token
  async login(login: string, password: string): Promise<TokenJWT | null> {
    // TODO:
    return null
  }
}
