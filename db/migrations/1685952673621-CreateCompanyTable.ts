import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCompanyTable1685952673621 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'company',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isGenerated: true,
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            length: '50',
          },
          {
            name: 'displayName',
            type: 'varchar',
            isNullable: false,
            length: '50',
          },
          {
            name: 'email',
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('company');
  }
}
