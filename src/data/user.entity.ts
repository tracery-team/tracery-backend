import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import { EventEntity } from 'src/data/event.entity'

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  nickname: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @ManyToMany(() => UserEntity, user => user.friends)
  @JoinTable()
  friends: UserEntity[]

  @ManyToMany(() => EventEntity, event => event.users)
  @JoinTable()
  events: EventEntity[]

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }

  validatePassword(inputPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, this.password)
  }
}
