import { Test } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JWTService } from './jwt.service';
import { User } from '../user/entity/user.entity';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JWTService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findByUsername: jest.fn(),
            updateToken: jest.fn(),
          },
        },
        {
          provide: JWTService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JWTService>(JWTService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
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
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      token: null,
      type: null,
    };

    beforeEach(() => {
      userService.create = jest.fn().mockResolvedValue(createdUser);
    });

    it('should register a new user successfully', async () => {
      const result = await authController.register(registerDto);

      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toBeTruthy();
    });
  });

  describe('login', () => {
    const loginDto = {
      username: 'johndoe',
      password: 'password',
      remember: false,
    };
    const existingUser: User = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      password: 'password',
      createdAt: null,
      deletedAt: null,
      updatedAt: null,
      token: null,
      type: null,
    };

    beforeEach(() => {
      userService.findByUsername = jest.fn().mockResolvedValue(existingUser);
      loginDto.password = 'password';
    });

    it('should throw an exception when username or password is incorrect', async () => {
      loginDto.password = '123';
      await expect(() => authController.login(loginDto)).rejects.toThrow(
        HttpException,
      );

      expect(userService.findByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
    });

    it('should create a token and return it when login is successful', async () => {
      const token = 'generated_token';

      userService.findByUsername = jest.fn().mockResolvedValue(existingUser);
      jwtService.sign = jest.fn().mockResolvedValue(token);

      const result = await authController.login(loginDto);

      expect(userService.findByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(existingUser, '1d');
      expect(result).toEqual({ token });
    });

    it('should create a long term token and return it when login is successful', async () => {
      const token = 'generated_token';
      loginDto.remember = true;

      userService.findByUsername = jest.fn().mockResolvedValue(existingUser);
      userService.updateToken = jest.fn().mockResolvedValue(true);
      jwtService.sign = jest.fn().mockResolvedValue(token);

      const result = await authController.login(loginDto);

      expect(userService.findByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(existingUser, '1d');
      expect(result).toEqual({ token });
    });
  });
});
