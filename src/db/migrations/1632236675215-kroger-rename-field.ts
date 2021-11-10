import { MigrationInterface, QueryRunner } from 'typeorm';

export class krogerRenameField1632236675215 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`krogerauths\` 
        CHANGE COLUMN \`userId\` familyId INT NULL
        ;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
