import { Book } from "../../book/entities/book.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {

    constructor(startPage: number, endPage: number, user: User, book: Book) {
        this.startPage = startPage;
        this.endPage = endPage;
        this.user = user;
        this.book = book;
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    startPage: number

    @Column()
    endPage: number

    @ManyToOne((_session) => User, (user) => user.sessions)
    user: User

    @ManyToOne((_session) => Book, (book) => book.sessions)
    book: Book

    @CreateDateColumn()
    createdAt: Date

}
