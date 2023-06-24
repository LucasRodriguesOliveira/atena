import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateClientBlackListTable1687574010200
  implements MigrationInterface
{
  private table: Table = new Table({
    name: 'client_black_list',
    columns: [
      {
        name: 'id',
        type: 'int',
        isGenerated: true,
        isNullable: false,
        isPrimary: true,
        generationStrategy: 'increment',
      },
      {
        name: 'clientId',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'reasonId',
        type: 'int',
        isNullable: false,
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
    await queryRunner.createForeignKeys(this.table, [
      new TableForeignKey({
        name: 'ClientBlackList_Client_fk',
        columnNames: ['clientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'client',
      }),
      new TableForeignKey({
        name: 'ClientBlackList_ClientBlackListReason_fk',
        columnNames: ['reasonId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'client_black_list_reason',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
