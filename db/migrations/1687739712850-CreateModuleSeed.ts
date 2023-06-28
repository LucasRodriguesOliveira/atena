import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModuleSeed1687739712850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('module', { description: 'AUTH' });
    await queryRunner.manager.insert('module', {
      description: 'BLACK_LIST_ITEM',
    });
    await queryRunner.manager.insert('module', {
      description: 'BLACK_LIST_REASON',
    });
    await queryRunner.manager.insert('module', { description: 'CLIENT' });
    await queryRunner.manager.insert('module', { description: 'COIN' });
    await queryRunner.manager.insert('module', { description: 'COMPANY' });
    await queryRunner.manager.insert('module', { description: 'USER_COMPANY' });
    await queryRunner.manager.insert('module', { description: 'CONTRACT' });
    await queryRunner.manager.insert('module', {
      description: 'COSTUMER_SERVICE',
    });
    await queryRunner.manager.insert('module', {
      description: 'INSTALLMENT_ITEM',
    });
    await queryRunner.manager.insert('module', {
      description: 'INSTALLMENT_TYPE',
    });
    await queryRunner.manager.insert('module', { description: 'MODULE' });
    await queryRunner.manager.insert('module', {
      description: 'PAYMENT_METHOD',
    });
    await queryRunner.manager.insert('module', { description: 'PERMISSION' });
    await queryRunner.manager.insert('module', {
      description: 'PERMISSION_GROUP',
    });
    await queryRunner.manager.insert('module', { description: 'SERVICE_PACK' });
    await queryRunner.manager.insert('module', {
      description: 'SERVICE_PACK_ITEM',
    });
    await queryRunner.manager.insert('module', {
      description: 'SERVICE_PACK_TYPE',
    });
    await queryRunner.manager.insert('module', {
      description: 'SERVICE_STAGE',
    });
    await queryRunner.manager.insert('module', {
      description: 'SUPPORT_TICKET',
    });
    await queryRunner.manager.insert('module', { description: 'USER' });
    await queryRunner.manager.insert('module', { description: 'USER_TYPE' });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('module', {
      description: [
        'AUTH',
        'BLACK_LIST_ITEM',
        'BLACK_LIST_REASON',
        'CLIENT',
        'COIN',
        'COMPANY',
        'USER_COMPANY',
        'CONTRACT',
        'SERVICE',
        'INSTALLMENT_ITEM',
        'INSTALLMENT_TYPE',
        'MODULE',
        'PAYMENT_METHOD',
        'PERMISSION',
        'PERMISSION_GROUP',
        'SERVICE_PACK',
        'SERVICE_PACK_ITEM',
        'SERVICE_PACK_TYPE',
        'SERVICE_STAGE',
        'SUPPORT_TICKET',
        'USER',
        'USER_TYPE',
      ],
    });
  }
}
