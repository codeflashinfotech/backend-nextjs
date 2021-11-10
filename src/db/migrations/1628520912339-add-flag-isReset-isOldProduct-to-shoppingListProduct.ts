import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFlagIsResetIsOldProductToShoppingListProduct1628520912339
  implements MigrationInterface
{
  /**
   * @description add columns to shoppingListProducts for reset|replace btn in app. with these flags user can replace product with new one
   * @param {TINYINT(1)} isReset this use for waiting for report product detail from device
   * @param {TINYINT(1)} isOldProduct this use for force user to change product if product need to be change
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE ShoppingListProducts ADD COLUMN isReset BOOLEAN NOT NULL DEFAULT 0,ADD COLUMN isOldProduct BOOLEAN NOT NULL DEFAULT 1;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE ShoppingListProducts DROP COLUMN isReset,DROP COLUMN isOldProduct;',
    );
  }
}
