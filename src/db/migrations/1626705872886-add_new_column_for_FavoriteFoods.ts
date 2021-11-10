import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNewColumnForFavoriteFoods1626705872886
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE FavoriteFoods ADD COLUMN VendorProductId varchar(255) ',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE FavoriteFoods DROP COLUMN VendorProductId',
    );
  }
}
