import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterAutoIncrementTo4201627046715571
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users AUTO_INCREMENT=450;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
