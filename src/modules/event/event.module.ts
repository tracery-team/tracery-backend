import { Module } from '@nestjs/common'
import { EventController } from './event.controller'
import { EventService } from './event.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEntity } from 'src/data/event.entity'
import { UserEntity } from 'src/data/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, UserEntity])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
