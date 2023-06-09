import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCoinTable1686058866888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'coin',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            length: '50',
          },
          {
            name: 'acronym',
            type: 'varchar',
            isNullable: false,
            length: '3',
          },
          {
            name: 'value',
            type: 'decimal',
            isNullable: false,
            precision: 10,
            scale: 4,
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('coin');
  }
}
