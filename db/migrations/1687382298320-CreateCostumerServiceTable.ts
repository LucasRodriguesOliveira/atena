import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCostumerServiceTable1687382298320
  implements MigrationInterface
{
  private costumerService: Table = new Table({
    name: 'costumer_service',
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
        name: 'userId',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'serviceStageId',
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
    await queryRunner.createTable(this.costumerService);
    await queryRunner.createForeignKeys(this.costumerService, [
      new TableForeignKey({
        name: 'CostumerService_Client_fk',
        columnNames: ['clientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'client',
      }),
      new TableForeignKey({
        name: 'CostumerService_User_fk',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
      new TableForeignKey({
        name: 'CostumerService_ServiceStage_fk',
        columnNames: ['serviceStageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'service_stage',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.costumerService);
  }
}
