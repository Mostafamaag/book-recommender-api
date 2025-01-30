import { Session } from "../../session/entities/session.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Book {

    constructor(name: string, numberOfPages: number) {
        this.name = name;
        this.numberOfPages = numberOfPages;
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    numberOfPages: number

    @OneToMany((_book) => Session, (session) => session.book)
    sessions: Session[]

}