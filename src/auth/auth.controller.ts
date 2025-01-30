import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @HttpCode(200)
    @Post('login')
    async login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ token: string }> {
        return this.authService.login(authCredentialsDto);
    }

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
        return this.authService.signUp(signUpDto);
    }

}
