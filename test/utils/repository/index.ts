import { FindOptionsWhere } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { RepositoryItem } from './repository-item';

type criteria<Entity> = FindOptionsWhere<Entity>;

interface RepositoryItemDependency<T> {
  name: string;
  criteria: criteria<T>;
}

export class RepositoryManager {
  private repositoryMap = new Map<
    string,
    RepositoryItem<EntityClassOrSchema>
  >();

  constructor(private readonly testingModule: TestingModule) {}

  add(repositoryItems: RepositoryItem<any>[]) {
    repositoryItems.forEach((repositoryItem) => {
      const name = repositoryItem.name;
      if (!this.repositoryMap.has(name)) {
        repositoryItem.Repository = this.testingModule;
        this.repositoryMap.set(name, repositoryItem);
      }
    });
  }

  private async findDependecies<Entity>(
    name: string,
    criteria: criteria<Entity>,
  ): Promise<RepositoryItemDependency<Entity>[]> {
    const repository = this.repositoryMap.get(name);
    const item = await repository.find(criteria);

    return Object.keys(item)
      .filter((key) => key.match(/Id/g))
      .map((key) => {
        return {
          name: key
            .replace(/\w{1}/, key.charAt(0).toUpperCase())
            .replace(/Id/, ''),
          criteria: { id: item[key] },
        };
      });
  }

  private async removeDependencies<Entity>(
    name: string,
    criteria: criteria<Entity>,
  ): Promise<void> {
    const dependencies = await this.findDependecies(name, criteria);

    if (!dependencies.length) {
      return;
    }

    await Promise.all(
      dependencies.map(({ name, criteria }) =>
        this.removeAndCheck(name, criteria),
      ),
    );
  }

  async remove<Entity>(
    name: string,
    criteria: criteria<Entity>,
    checkForDependencies = true,
  ): Promise<boolean> {
    const repository = this.repositoryMap.get(name);

    if (checkForDependencies) {
      await this.removeDependencies(name, criteria);
    }

    return repository.remove(criteria);
  }

  async removeAndCheck<Entity>(
    name: string,
    criteria: criteria<Entity>,
    checkForDependencies = true,
  ): Promise<void> {
    const repository = this.repositoryMap.get(name);

    if (checkForDependencies) {
      await this.removeDependencies(name, criteria);
    }

    return repository.removeAndCheck(criteria);
  }
}
