import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserSeed1687956910710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [userType] = await queryRunner.manager.query(
      'SELECT id FROM user_type',
    );
    await queryRunner.manager.insert('user', {
      username: 'admin',
      name: 'Administrator',
      password: '$2a$12$AVzE3dfvSoPD1lkb0ki1G.SRq0oJpjhLSF0mRtrMmHx1jsrx.6eiG', // admin123
      token: '',
      userTypeId: userType.id,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('user', { username: 'admin' });
  }
}
