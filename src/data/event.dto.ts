import { Transform } from 'class-transformer'
import { UserDto } from './user.dto'

export class EventDto {
  id: number
  title: string
  description: string
  location: string
  date: Date

  @Transform(({ value }) => {
    return value.map(user => {
      const { password, friends, ...safeUser } = user
      return safeUser
    })
  })
  users: UserDto[]
}
