import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserEntity } from 'src/data/user.entity'
import { UserService } from './user.service'

/**
 * The module that handles user-related operations.
 *
 * This module is responsible for managing user data, including retrieving users,
 * adding and removing friends, and other user-related services. It imports the necessary
 * components such as the `UserEntity` and integrates with the database via TypeORM.
 *
 * It provides the `UserService` to other parts of the application and exposes the
 * `UserController` to handle incoming HTTP requests related to user actions.
 *
 * @module UserModule
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
