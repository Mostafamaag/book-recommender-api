import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';

import { SessionRepository } from './session.repository';


@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [SessionController],
  providers: [
    SessionRepository, SessionService,
  ],
  exports: [SessionService, SessionRepository]
})
export class SessionModule { }
