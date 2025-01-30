import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { identity } from 'rxjs';
import { User } from '../user/entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService
  const mockAuthService = {
    login: jest.fn(),
    signUp: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ],
    }).overrideProvider(AuthService).useValue(mockAuthService).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {

    it('should return token successfully', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'user@gmail.com',
        password: 'password123'
      };

      mockAuthService.login.mockResolvedValue({ token: 'token123' });
      const result = await authController.login(authCredentialsDto);
      expect(result).toEqual({ token: 'token123' });
      expect(authService.login).toHaveBeenCalledWith(authCredentialsDto);
    })
  })

  describe('signup', () => {

    it('should return user successfully', async () => {
      const signUpDto: SignUpDto = {
        name: 'user',
        email: 'user@gmail.com',
        password: 'password123'
      };

      const user = new User(signUpDto.name, signUpDto.email, signUpDto.password);

      mockAuthService.signUp.mockResolvedValue(user);
      const result = await authController.signUp(signUpDto);
      expect(result).toEqual(user);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    })
  })


});
