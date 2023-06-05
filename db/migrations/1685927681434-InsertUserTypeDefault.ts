import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUserTypeDefault1685927681434 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('user_type', {
      description: 'DEFAULT',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('user_type', {
      description: 'DEFAULT',
    });
  }
}
