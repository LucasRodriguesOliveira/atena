import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateInstallmentTable1686447882372 implements MigrationInterface {
  private installmentTable: Table = new Table({
    name: 'installment',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isGenerated: true,
        isNullable: false,
        isPrimary: true,
        generationStrategy: 'uuid',
      },
      {
        name: 'contractId',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'installmentTypeId',
        type: 'int',
        isNullable: false,
      },
      {
        name: 'paymentMethodId',
        type: 'int',
        isNullable: false,
      },
      {
        name: 'coinId',
        type: 'int',
        isNullable: false,
      },
      {
        name: 'value',
        type: 'decimal',
        precision: 10,
        scale: 4,
        isNullable: false,
      },
      {
        name: 'valuePaid',
        type: 'decimal',
        precision: 10,
        scale: 4,
        isNullable: true,
      },
      {
        name: 'expiresAt',
        type: 'date',
        isNullable: false,
      },
      {
        name: 'paidAt',
        type: 'timestamp',
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
    await queryRunner.createTable(this.installmentTable);
    await queryRunner.createForeignKeys(this.installmentTable, [
      new TableForeignKey({
        name: 'Installment_Contract_fk',
        columnNames: ['contractId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contract',
      }),
      new TableForeignKey({
        name: 'Installment_InstallmentType_fk',
        columnNames: ['installmentTypeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'installment_type',
      }),
      new TableForeignKey({
        name: 'Installment_PaymentMethod_fk',
        columnNames: ['paymentMethodId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'payment_method',
      }),
      new TableForeignKey({
        name: 'Installment_Coin_fk',
        columnNames: ['coinId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'coin',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.installmentTable);
  }
}
