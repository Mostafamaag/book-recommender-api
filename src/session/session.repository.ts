import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "./entities/session.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SessionRepository {

    constructor(
        @InjectRepository(Session)
        private sessionRepository: Repository<Session>,
        private dataSource: DataSource
    ) { }

    async findById(id: number) {
        return this.sessionRepository.findOneBy({ id });
    }
    async save(session: Session) {
        return this.sessionRepository.save(session);
    }

    async findAll() {
        return this.dataSource.query(
            'select * from session order by "startPage" asc'
        )
    }
}
