import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateServiceStageTable1686949375328
  implements MigrationInterface
{
  private serviceStage: Table = new Table({
    name: 'service_stage',
    columns: [
      {
        name: 'id',
        type: 'int',
        isGenerated: true,
        isPrimary: true,
        isNullable: false,
        generationStrategy: 'increment',
      },
      {
        name: 'description',
        type: 'varchar',
        isNullable: false,
        length: '50',
      },
      {
        name: 'status',
        type: 'boolean',
        isNullable: false,
        default: true,
      },
      {
        name: 'createdAt',
        type: 'timestamp',
        isNullable: false,
        default: 'now()',
      },
      {
        name: 'updatedAt',
        type: 'timestamp',
        isNullable: false,
        default: 'now()',
      },
      {
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: true,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.serviceStage);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.serviceStage);
  }
}
