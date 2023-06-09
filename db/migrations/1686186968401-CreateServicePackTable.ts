import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateServicePackTable1686186968401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'service_pack',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isNullable: false,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'duration',
            type: 'int',
            isNullable: false,
            default: 12,
            comment: 'in months',
          },
          {
            name: 'subscriptionPrice',
            type: 'decimal',
            precision: 10,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'monthlyPayment',
            type: 'decimal',
            precision: 10,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'lateFee',
            type: 'decimal',
            precision: 10,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'monthlyFee',
            type: 'decimal',
            precision: 10,
            scale: 5,
            isNullable: false,
          },
          {
            name: 'status',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'coinId',
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
      }),
    );

    await queryRunner.createForeignKey(
      'service_pack',
      new TableForeignKey({
        name: 'ServicePack_Coin_fk',
        columnNames: ['coinId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'coin',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('service_pack');
  }
}
