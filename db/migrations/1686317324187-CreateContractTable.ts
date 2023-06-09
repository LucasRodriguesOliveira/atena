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
          // TODO: add all the columns remaining
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contract');
  }
}
