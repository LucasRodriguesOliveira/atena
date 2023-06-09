import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUserTypeAdmin1685913570751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('user_type', {
      description: 'ADMIN',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('user_type', {
      description: 'ADMIN',
    });
  }
}
