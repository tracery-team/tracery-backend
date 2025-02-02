import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {plainToInstance} from "class-transformer";
import {UserEntity} from "src/data/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class ProfileService {
  constructor (
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUserInfo(userId: number): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [ 'friends' ], // TODO: add events later
    })
    return plainToInstance(UserEntity, user)
  }
}
