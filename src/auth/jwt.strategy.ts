
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { DataSource } from "typeorm";
import { JwtPayload } from "jsonwebtoken"
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { User } from '../user/entities/user.entity';
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private logger = new Logger('JwtStrategy');
    constructor
        (
            private readonly dataSource: DataSource,
            private readonly configService: ConfigService
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { userId } = payload;
        const user = await this.dataSource.getRepository(User).findOneBy({ id: userId });
        if (!user) {
            throw new UnauthorizedException("Invalid token");
        }

        this.logger.log(user);
        return user;
    }

}