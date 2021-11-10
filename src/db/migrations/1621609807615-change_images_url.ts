import { MigrationInterface, QueryRunner } from 'typeorm';
import { CustomFoods } from '../../app/products/entities/custom-foods.entity';
import { ShoppingListProduct } from '../../app/systems/entities/shopping-list-products.entity';
import { FavoriteFoods } from '../../app/products/entities/favorite.foods.entity';
import { FoodActivityLog } from '../../app/logs/entities/food-activity-log.entity';
import { ShoppingListInitialProduct } from '../../app/systems/entities/shopping-list-initial-product.entity';
import { FoodActivityLogRealTime } from '../../app/systems/entities/food-activity-log-real-time.entity';

export class changeImagesUrl1621609807615 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      const where = {
        string: 'ImageURL LIKE :bucketOne OR ImageURL LIKE :bucketTwo',
        parameters: {
          bucketOne: `%initialproductlistimages%`,
          bucketTwo: '%pantryonimages%',
        },
      };
      const entities = [
        ShoppingListProduct,
        CustomFoods,
        FavoriteFoods,
        FoodActivityLog,
        ShoppingListInitialProduct,
        FoodActivityLogRealTime,
      ];
      for (const entity of entities) {
        const result = await queryRunner.manager
          .getRepository(entity)
          .createQueryBuilder()
          .where(where.string, where.parameters)
          .getMany();
        await save(queryRunner, result);
      }
    } catch (e) {
      console.log('migration Error => \n', e);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log("this migration doesn't have revert");
  }
}

async function save(queryRunner: QueryRunner, entityResults: Array<any>) {
  for (const result of entityResults) {
    if (result.ImageURL.match('pantryonimages|initialproductlistimages')[0]) {
      const imageArray: Array<string> = result.ImageURL.split('/');
      result.ImageURL = imageArray[imageArray.length - 1];
      await queryRunner.manager.save(result);
    }
  }
}
