import { UserService } from '../user/user.service';
import { JWTService } from './jwt.service';
import { User } from '../user/entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../user-type/entity/user-type.entity';
import { UserTypeService } from '../user-type/user-type.service';
import { HttpException } from '@nestjs/common';
import { FindUserDto } from '../user/dto/find-user.dto';

describe.only('JwtService', () => {
  let jwtService: JWTService;
  let userService: UserService;
  let userTypeService: UserTypeService;

  const userRepository = {
    findOne: jest.fn(),
  };
  const userTypeRepository = {};

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        JWTService,
        UserService,
        UserTypeService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(UserType),
          useValue: userTypeRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt') {
                return {
                  secret: 'test',
                };
              }

              return null;
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'test'),
          },
        },
      ],
    }).compile();

    jwtService = moduleRef.get<JWTService>(JWTService);
    userService = moduleRef.get<UserService>(UserService);
    userTypeService = moduleRef.get<UserTypeService>(UserTypeService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userTypeService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validate', () => {
    describe('successfully validates', () => {
      const user: User = {
        id: '0',
        name: 'test',
        username: 'test.test',
        type: {
          id: 0,
          description: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
          users: [],
          permissionGroups: [],
        },
        password: 'test',
        token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      beforeEach(() => {
        userRepository.findOne.mockResolvedValueOnce(user);
      });

      it('should validate a jwt token returning a user', async () => {
        const result = await jwtService.validate({
          id: '0',
        });

        expect(result).toStrictEqual(FindUserDto.from(user));
      });
    });

    describe('throws an error', () => {
      beforeEach(() => {
        userRepository.findOne.mockResolvedValueOnce({});
      });

      it('should thrown an error for not finding a user', async () => {
        await expect(() => jwtService.validate({ id: '0' })).rejects.toThrow(
          HttpException,
        );
      });
    });
  });

  describe('sign', () => {
    const user: User = {
      id: '0',
      name: 'test',
      username: 'test',
      password: '123',
      token: null,
      type: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    };
    const token = 'test';

    it('should sign a token successfully', async () => {
      const result = await jwtService.sign(user, '1d');

      expect(result).toBe(token);
    });
  });
});
