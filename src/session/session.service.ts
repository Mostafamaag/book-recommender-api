import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { Session } from './entities/session.entity';
// import { BookService } from '../book/book.service';
// import { CreateSessionDto } from './dto/create-session.dto';
import { User } from '../user/entities/user.entity';
import { CustomResponse } from './dto/custom-response';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class SessionService {
    logger = new Logger('SessionService');

    constructor(
        private readonly sessionRepository: SessionRepository,

    ) { }

    async addSession(user: User, book: Book, startPage: number, endPage: number) {

        if (startPage > endPage) {
            throw new BadRequestException("End page should be greater then starting page");
        }

        if (endPage > book.numberOfPages) {
            throw new BadRequestException(`Enter valid end page, less than ${book.numberOfPages}`);
        }


        const newSession = new Session(
            startPage,
            endPage,
            user,
            book,
        )
        // this.logger.debug(JSON.stringify(newSession));

        await this.sessionRepository.save(newSession);

        return new CustomResponse("success");
    }

    async getAllSessions() {
        const sessions = await this.sessionRepository.findAll();
        return sessions;
    }
}
