import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';

type criteria<Entity> =
  | string
  | string[]
  | number
  | number[]
  | Date
  | Date[]
  | ObjectID
  | ObjectID[]
  | FindOptionsWhere<Entity>;

export class RepositoryItem<Entity extends EntityClassOrSchema> {
  private repository: Repository<Entity>;
  public name: string;

  constructor(private readonly entity: Entity) {
    this.name = entity
      .toString()
      .replace(/{|}|class/g, '')
      .trim();
  }

  set Repository(testingModule: TestingModule) {
    this.repository = testingModule.get<Repository<Entity>>(
      getRepositoryToken(this.entity),
    );
  }

  async find(criteria: FindOptionsWhere<Entity>): Promise<Entity> {
    return this.repository.findOne({
      where: criteria,
      withDeleted: true,
    });
  }

  async remove(criteria: criteria<Entity>): Promise<boolean> {
    const { affected } = await this.repository.delete(criteria);

    return affected > 0;
  }

  async removeAndCheck(criteria: criteria<Entity>): Promise<void> {
    const isRemoved = await this.remove(criteria);

    if (!isRemoved) {
      throw new Error(
        `Could not remove ${this.entity.constructor.name} - (${JSON.stringify(
          criteria,
        )})`,
      );
    }
  }
}
