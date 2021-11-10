import { CustomFoods } from './../../products/entities/custom-foods.entity';
import { FavoriteFoods } from 'src/app/products/entities/favorite.foods.entity';
import { Hub } from 'src/app/systems/entities/hub.entity';
import { ShoppingList } from 'src/app/systems/entities/shopping-list.entity';
import { CommonEntity } from 'src/shared/entity/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { FamilyUser } from './family-user.entity';
import { FoodActivityLog } from '../../logs/entities/food-activity-log.entity';
import { FoodActivityLogRealTime } from '../../systems/entities/food-activity-log-real-time.entity';

@Entity('families')
export class Family extends CommonEntity {
  @Column()
  familyName: string;

  @OneToMany(() => FamilyUser, (familyUser) => familyUser.family)
  familyUsers: FamilyUser[];

  @OneToMany(() => Hub, (hub) => hub.family)
  hubs: Hub[];

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.family)
  shoppingLists: ShoppingList[];

  @OneToMany(() => FavoriteFoods, (favoriteFood) => favoriteFood.family)
  favoriteFoods: FavoriteFoods[];

  @OneToMany(() => CustomFoods, (customFood) => customFood.family)
  customFoods: CustomFoods[];

  @OneToMany(() => FoodActivityLog, (foodActivityLog) => foodActivityLog.family)
  foodActivityLogs: FoodActivityLog[];

  @OneToMany(
    () => FoodActivityLogRealTime,
    (foodActivityLogRealTime) => foodActivityLogRealTime.family,
  )
  foodActivityLogRealTime: FoodActivityLogRealTime[];
}
