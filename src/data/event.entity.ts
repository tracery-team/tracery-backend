import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { UserEntity } from 'src/data/user.entity'

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  title: string

  @Column()
  description: string

  @Column()
  location: string

  @Column({ type: 'timestamptz' })
  date: Date

  @ManyToMany(() => UserEntity, user => user.events)
  users: UserEntity[]
}
