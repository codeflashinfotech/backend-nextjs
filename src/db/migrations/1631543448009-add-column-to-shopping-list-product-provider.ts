import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnToShoppingListProductProvider1631543448009
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE ShoppingListProducts ADD COLUMN VendorProviderName varchar(255) ',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE ShoppingListProducts DROP COLUMN VendorProviderName',
    );
  }
}
