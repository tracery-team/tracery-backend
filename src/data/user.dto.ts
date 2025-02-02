import { Exclude, Transform } from 'class-transformer'
import { EventDto } from './event.dto'

export class UserDto {
  id: number
  nickname: string
  firstName: string
  lastName: string
  email: string

  @Exclude()
  password: string

  @Transform(({ value }) => {
    const { friends, password, ...safeUser } = value
    return safeUser
  })
  friends: UserDto[]

  @Transform(({ value }) => {
    const { password, friends, ...safeEventData } = value
    return safeEventData
  })
  events: EventDto[]
}
