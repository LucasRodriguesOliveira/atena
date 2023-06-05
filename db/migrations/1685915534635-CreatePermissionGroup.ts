import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePermissionGroup1685915534635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permission_group',
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
            name: 'userTypeId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'moduleId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'permissionId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('permission_group', [
      new TableForeignKey({
        name: 'permissiongroup_usertype_fk',
        columnNames: ['userTypeId'],
        referencedTableName: 'user_type',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'permissiongroup_module_fk',
        columnNames: ['moduleId'],
        referencedTableName: 'module',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'permissiongroup_permission_fk',
        columnNames: ['permissionId'],
        referencedTableName: 'permission',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permission_group');
  }
}
