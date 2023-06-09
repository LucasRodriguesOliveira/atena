import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateContractTable1686317324187 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contract',
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
            name: 'servicePackId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'clientId',
            type: 'uuid',
            isNullable: false,
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
            name: 'expiresAt',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'coinId',
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
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contract');
  }
}
