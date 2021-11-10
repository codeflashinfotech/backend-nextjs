import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNewColumnForShoppingListProduct1626702766785
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE ShoppingListProducts ADD COLUMN VendorProductId varchar(255) ',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE ShoppingListProducts DROP COLUMN VendorProductId',
    );
  }
}
