import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
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
    private jwtService: JwtService,
  ) {}

  async signUp(userData: Partial<UserEntity>): Promise<SignupStatus> {
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
    const user = await this.userRepository.findOne({
      where: [{ email: login }, { nickname: login }],
    })
    if (user === null) {
      return null
    }
    const verdict = await user.validatePassword(password)
    if (!verdict) {
      return null
    }
    const payload = {
      email: user.email,
      nickname: user.nickname,
    }
    const token = await this.jwtService.signAsync(payload)
    return token
  }
}
