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
    const item = await repository.find(criteria, true);

    if (!item) {
      return [];
    }

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
    dependencies: RepositoryItemDependency<Entity>[],
  ): Promise<void> {
    await Promise.all(
      dependencies.map(({ name: depName, criteria }) =>
        this.removeAndCheck(depName, criteria),
      ),
    );
  }

  async removeAndCheck<Entity>(
    name: string,
    criteria: criteria<Entity>,
    checkForDependencies = true,
  ): Promise<void> {
    const repository = this.repositoryMap.get(name);
    let dependencies = [];

    if (checkForDependencies) {
      try {
        dependencies = await this.findDependecies(name, criteria);
      } catch (err) {
        throw new Error(
          `Could not find dependencies for [${name}] with criteria ${JSON.stringify(
            criteria,
          )}`,
        );
      }
    }

    await repository.removeAndCheck(criteria);

    if (checkForDependencies) {
      await this.removeDependencies(dependencies);
    }
  }

  async find<Entity>(
    name: string,
    criteria: FindOptionsWhere<Entity>,
  ): Promise<Entity> {
    const repository = this.repositoryMap.get(name);

    return repository.find(criteria, false) as Entity;
  }
}
