import { Repository } from 'typeorm';
import { MockType } from './mock-type';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    findBy: jest.fn((entity) => entity),
    findOneBy: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
    softDelete: jest.fn((entity) => entity),
  }),
);
