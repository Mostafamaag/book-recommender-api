import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  }

  //: Partial<Record<keyof JwtService, jest.Mock>>
  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],

    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('throw NotFoundException if email is wrong', async () => {

      const authCredentialsDto: AuthCredentialsDto = {
        email: 'test@gmail.com',
        password: '123456'
      }
      mockUserRepository.findOneBy.mockResolvedValue(null);
      await expect(authService.login(authCredentialsDto)).rejects.toThrow(NotFoundException);
    })

    it('throw UnauthorizedException if password is wrong', async () => {

      mockUserRepository.findOneBy.mockResolvedValue(
        {
          email: 'test@gmail.com',
          password: 'hashed123'
        }
      );

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); //mock function
      await expect(
        authService.login({ email: 'test@gmail.com', password: 'wrongPassword' })
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@gmail.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashed123');
    })

    it('should return access token', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'test@gmail.com',
        password: 'rightPassword'
      }

      const user = new User('test', 'test@gmail.com', 'hashedPassword');
      mockUserRepository.findOneBy.mockResolvedValue(user);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token123');

      const token = await authService.login(authCredentialsDto);

      expect(token).toEqual({ token: 'token123' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ id: user.id });

    })
  })

  describe('signup', () => {

    it('throw ConflictException if email already exist', async () => {
      const signUpDto: SignUpDto = {
        name: 'test',
        email: 'test@gmail.com',
        password: 'password123',
      }
      mockUserRepository.findOneBy.mockResolvedValue({ email: 'test@gmail.com' } as User);
      await expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@gmail.com' });

    })

    it('should returns new user', async () => {
      const signUpDto: SignUpDto = {
        name: 'test',
        email: 'test@gmail.com',
        password: 'password123',
      }
      const newUser = new User(signUpDto.name, signUpDto.email, 'hashedPassword');
      mockUserRepository.findOneBy.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockResolvedValue(newUser);

      const user = await authService.signUp(signUpDto);

      expect(user).toEqual(newUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@gmail.com' });
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    })

  })


});

