import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSupportTicketTable1687586772597
  implements MigrationInterface
{
  private table: Table = new Table({
    name: 'support_ticket',
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
        name: 'clientId',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'userId',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'reason',
        type: 'varchar',
        length: '50',
        isNullable: false,
      },
      {
        name: 'details',
        type: 'text',
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
        name: 'SupportTicket_Client_fk',
        columnNames: ['clientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'client',
      }),
      new TableForeignKey({
        name: 'SupportTicket_User_fk',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
