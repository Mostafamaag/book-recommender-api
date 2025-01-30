import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "./entities/book.entity";
import { In, Repository } from "typeorm";
import { UpdateBookDto } from "./dto/update-book.dto";


@Injectable()
export class BookRepository {
    constructor(@InjectRepository(Book) private readonly bookRepository: Repository<Book>) { }

    async findAll() {
        return this.bookRepository.createQueryBuilder("book")
            .leftJoinAndSelect("book.sessions", "session")
            .where("session.id IS NOT NULL")
            .orderBy("session.startPage", "ASC")
            .getMany();

    }

    async save(book: Book): Promise<Book> {
        return this.bookRepository.save(book);
    }

    async getTopBooks(ids: number[]) {
        return this.bookRepository.find({
            where: { id: In(ids) },
            select: ['id', 'name', 'numberOfPages']
        });
    }

    async update(id: number, updateBookDto: UpdateBookDto) {
        return this.bookRepository.update(id, updateBookDto);
    }

    async findById(id: number): Promise<Book> {
        return this.bookRepository.findOneBy({ id });
    }

    async delete(book: Book) {
        return this.bookRepository.remove(book);
    }


}