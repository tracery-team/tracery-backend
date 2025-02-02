import { Module } from '@nestjs/common'
import { EventController } from './event.controller'
import { EventService } from './event.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEntity } from 'src/data/event.entity'
import { UserEntity } from 'src/data/user.entity'

/**
 * Module that handles event-related operations.
 *
 * This module encapsulates all the logic for managing events, including retrieving,
 * adding, and removing events, as well as associating them with users. It imports
 * the necessary repositories and provides controllers and services for managing events.
 *
 * @module EventModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, UserEntity])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
