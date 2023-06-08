import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateServicePackItemTable1686265843803
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'service_pack_item',
        columns: [
          {
            name: 'id',
            type: 'int',
            isNullable: false,
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'itemTypeId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'servicePackId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'int',
            isNullable: false,
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
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('service_pack_item', [
      new TableForeignKey({
        name: 'ServicePackItem_ServicePack_fk',
        columnNames: ['servicePackId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'service_pack',
      }),
      new TableForeignKey({
        name: 'ServicePackItem_ServicePackItemType_fk',
        columnNames: ['itemTypeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'service_pack_item_type',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('service_pack_item');
  }
}
