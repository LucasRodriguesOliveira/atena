import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateClientBlackListReasonTable1687568092067
  implements MigrationInterface
{
  private table: Table = new Table({
    name: 'client_black_list_reason',
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
        name: 'title',
        type: 'varchar',
        length: '50',
        isNullable: false,
      },
      {
        name: 'details',
        type: 'text',
        isNullable: true,
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
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
