import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from 'src/data/user.entity'

/**
 * The module responsible for user profile-related operations.
 *
 * This module provides the necessary components to handle user profile-related
 * actions, such as fetching user information. It integrates with the `UserEntity`
 * for database interactions and exposes the `ProfileService` for business logic.
 * The module also includes the `ProfileController` to handle incoming HTTP requests
 * related to profile actions.
 *
 * @module ProfileModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
