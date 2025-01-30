import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {
    }

    async signUp(signUpDto: SignUpDto): Promise<User> {

        const { password, email, name } = signUpDto;
        const user = await this.userRepository.findOneBy({ email });
        if (user) {
            throw new ConflictException("This email is already user, try another one!");
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User(
            name,
            email,
            hashedPassword,
        );

        await this.userRepository.save(newUser);
        return newUser;
    }

    async login(authCredentialsDto: AuthCredentialsDto): Promise<{ token: string }> {
        const { email, password } = authCredentialsDto;

        const existingUser = await this.userRepository.findOneBy({ email });

        if (!existingUser) {
            throw new NotFoundException("User not found!");
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            throw new UnauthorizedException("Wrong email or password");
        }

        const payload = { userId: existingUser.id };
        const token = await this.jwtService.signAsync(payload);
        return { token };
    }

}
