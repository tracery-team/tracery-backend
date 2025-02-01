import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
}
