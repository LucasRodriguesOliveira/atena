import { Test } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JWTService } from './jwt.service';
import { User } from '../user/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from '../../config/env/env.config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTypeService } from '../user-type/user-type.service';
import { UserType } from '../user-type/entity/user-type.entity';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JWTService;

  const userRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    findOneBy: jest.fn(),
  };
  const userTypeRepository = {
    findOneBy: jest.fn(),
  };
  const jwtRepository = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(envConfig)],
      providers: [
        AuthService,
        UserService,
        UserTypeService,
        JWTService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: JwtService, useValue: jwtRepository },
        { provide: getRepositoryToken(UserType), useValue: userTypeRepository },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JWTService>(JWTService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'password',
      userTypeId: 1,
    };
    const createdUser: User = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      token: '',
      type: {
        id: 0,
        description: 'test type',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        users: [],
      },
    };

    beforeEach(() => {
      userRepository.save.mockResolvedValue(createdUser);
    });

    it('should register a new user successfully', async () => {
      const result = await authService.register(registerDto);

      expect(userRepository.save).toHaveBeenCalled();
      expect(userTypeRepository.findOneBy).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('login', () => {
    const existingUser: User = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      token: '',
      type: {
        id: 0,
        description: 'test type',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        users: [],
      },
    };

    beforeAll(() => {
      userRepository.findOne.mockResolvedValue(existingUser);
    });

    describe('incorrect passsword', () => {
      const loginDto = {
        username: 'johndoe',
        password: '123',
        remember: false,
      };

      it('should throw an exception when username or password is incorrect', async () => {
        await expect(() => authService.login(loginDto)).rejects.toThrow(
          HttpException,
        );

        expect(userRepository.findOne).toHaveBeenCalled();
      });
    });

    describe('correct password', () => {
      const loginDto = {
        username: 'johndoe',
        password: 'password',
        remember: false,
      };
      const token = 'generated_token';

      beforeAll(async () => {
        existingUser.password = await userService.hashPassword(
          existingUser.password,
        );
        jwtRepository.sign.mockResolvedValue(token);
        userRepository.update.mockResolvedValueOnce({ affected: 1 });
        userRepository.findOneBy.mockResolvedValueOnce(existingUser);
      });

      it('should create a token and return it when login is successful', async () => {
        const result = await authService.login(loginDto);

        expect(userRepository.findOne).toHaveBeenCalled();
        expect(jwtRepository.sign).toHaveBeenCalled();
        expect(result).toEqual(token);
      });

      it('should create a long term token and return it when login is successful', async () => {
        loginDto.remember = true;

        const result = await authService.login(loginDto);

        expect(userRepository.findOne).toHaveBeenCalled();
        expect(jwtRepository.sign).toHaveBeenCalled();
        expect(result).toEqual(token);
      });
    });
  });
});
