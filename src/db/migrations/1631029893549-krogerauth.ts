import { MigrationInterface, QueryRunner } from 'typeorm';

export class krogerauth1631029893549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`krogerauths\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`userId\` INT NULL,
        \`refresh_token\` VARCHAR(255) NULL,
        \`token_type\` VARCHAR(255) NULL,
        \`expires_in\` BIGINT NULL,
        \`access_token\` VARCHAR(1000) NULL,
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deletedAt\` DATETIME NULL,
        PRIMARY KEY (\`id\`)
    )
    COLLATE='utf8mb4_unicode_ci'
    ;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
