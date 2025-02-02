import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './data/user.entity'
import { ProfileModule } from './modules/profile/profile.module'
import { EventModule } from './modules/event/event.module'
import { UserModule } from './modules/user/user.module'
import { EventEntity } from './data/event.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [UserEntity, EventEntity],
      synchronize: true, // TODO: migrations
    }),
    AuthModule,
    EventModule,
    UserModule,
    ProfileModule,
  ],
})
export class AppModule {}
