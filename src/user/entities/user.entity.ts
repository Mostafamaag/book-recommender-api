import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/role.enum";
import { Session } from "../../session/entities/session.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User {

    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    @Exclude()
    password: string

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role

    @OneToMany((_user) => Session, (session) => session.user, { onDelete: 'CASCADE' })
    sessions: Session[]

}
