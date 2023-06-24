import { Test } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JWTService } from './jwt.service';
import { User } from '../user/entity/user.entity';
import { AuthController } from './auth.controller';
import { UserTypeService } from '../user-type/user-type.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserType } from '../user-type/entity/user-type.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let userTypeService: UserTypeService;
  let jwtService: JWTService;

  const userRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  };
  const userTypeRepository = {
    findOneBy: jest.fn(),
  };
  const jwtRepository = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        UserTypeService,
        {
          provide: JWTService,
          useValue: jwtRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(UserType),
          useValue: userTypeRepository,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    userTypeService = moduleRef.get<UserTypeService>(UserTypeService);
    jwtService = moduleRef.get<JWTService>(JWTService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(userTypeService).toBeDefined();
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
      userCompanies: [],
      costumerServices: [],
      type: {
        id: 0,
        description: 'test type',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        users: [],
        permissionGroups: [],
      },
    };

    beforeEach(() => {
      userRepository.save.mockResolvedValue(createdUser);
    });

    it('should register a new user successfully', async () => {
      const result = await authController.register(registerDto);

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
      userCompanies: [],
      costumerServices: [],
      token: '',
      type: {
        id: 0,
        description: 'test type',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        users: [],
        permissionGroups: [],
      },
    };

    beforeAll(() => {
      userRepository.findOne.mockResolvedValue(existingUser);
      userRepository.findOneBy.mockResolvedValue(existingUser);
    });

    describe('incorrect password', () => {
      const loginDto = {
        username: 'johndoe',
        password: '123',
        remember: false,
      };

      it('should throw an exception when username or password is incorrect', async () => {
        await expect(() => authController.login(loginDto)).rejects.toThrow(
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
        const result = await authController.login(loginDto);

        expect(userRepository.findOne).toHaveBeenCalled();
        expect(jwtRepository.sign).toHaveBeenCalled();
        expect(result).toEqual(token);
      });

      it('should create a long term token and return it when login is successful', async () => {
        const result = await authController.login(loginDto);

        expect(userRepository.findOne).toHaveBeenCalled();
        expect(jwtRepository.sign).toHaveBeenCalled();
        expect(result).toEqual(token);
      });
    });
  });
});
