import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookRepository } from './book.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { SessionService } from '../session/session.service';
import { SessionRepository } from '../session/session.repository';
import { Session } from '../session/entities/session.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Session, User])],
  controllers: [BookController],
  providers: [
    SessionRepository, SessionService,
    BookRepository, BookService,
  ],
  exports: [BookService]
})
export class BookModule { }
