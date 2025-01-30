import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from './session/session.module';
import { User } from './user/entities/user.entity';
import { Session } from './session/entities/session.entity';
import { Book } from './book/entities/book.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          port: configService.get('DB_PORT'),
          host: configService.get('DB_HOST'),
          database: configService.get('DB_DATABASE'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          entities: [User, Session, Book],
          autoLoadEntities: true,
          synchronize: true,
          // ssl: {
          //   rejectUnauthorized: false,  // allow self-signed SSL certificates
          // },
        }
      },
    }),
    UserModule, BookModule, AuthModule, SessionModule
  ],

})
export class AppModule { }
