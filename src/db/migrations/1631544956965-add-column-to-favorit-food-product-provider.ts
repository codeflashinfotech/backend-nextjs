import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnToFavoritFoodProductProvider1631544956965
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE FavoriteFoods ADD COLUMN VendorProviderName varchar(255) ',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE FavoriteFoods DROP COLUMN VendorProviderName',
    );
  }
}
