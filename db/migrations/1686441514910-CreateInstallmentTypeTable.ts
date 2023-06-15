import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInstallmentTypeTable1686441514910
  implements MigrationInterface
{
  private installmentTable: Table = new Table({
    name: 'installment_type',
    columns: [
      {
        name: 'id',
        type: 'int',
        isNullable: false,
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'description',
        type: 'varchar',
        length: '50',
        isNullable: false,
      },
      {
        name: 'status',
        type: 'boolean',
        default: true,
        isNullable: false,
      },
      {
        name: 'createdAt',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      },
      {
        name: 'updatedAt',
        type: 'timestamp',
        default: 'now()',
        isNullable: false,
      },
      {
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: true,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.installmentTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.installmentTable);
  }
}
