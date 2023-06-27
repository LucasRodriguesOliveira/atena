import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionsSeed1687739458331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('permission', { description: 'FIND' });
    await queryRunner.manager.insert('permission', { description: 'CREATE' });
    await queryRunner.manager.insert('permission', { description: 'LIST' });
    await queryRunner.manager.insert('permission', { description: 'UPDATE' });
    await queryRunner.manager.insert('permission', { description: 'DELETE' });
    await queryRunner.manager.insert('permission', { description: 'REGISTER' });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('permission', {
      description: ['FIND', 'CREATE', 'LIST', 'UPDATE', 'DELETE', 'REGISTER'],
    });
  }
}
