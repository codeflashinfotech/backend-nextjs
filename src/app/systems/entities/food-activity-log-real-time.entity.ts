import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Family } from '../../families/entities/family.entity';
import { User } from '../../users/users.entity';
import { Hub } from './hub.entity';
import { ShoppingListProduct } from './shopping-list-products.entity';

@Entity('FoodActivityLogRealtime')
export class FoodActivityLogRealTime {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'longtext', default: null, nullable: false })
  ActivityData: string;

  @Column({ type: 'float', default: 0, nullable: false })
  Weight: number;

  @Column({ type: 'float', default: 0, nullable: false })
  PreviousWeight: number;

  @Column({ type: 'int', default: 1, nullable: false })
  Active: number;

  @Column({ type: 'int', default: 1 })
  ActivityType: number;

  @Column({ type: 'varchar', default: null })
  FoodName: string;

  @Column({ type: 'varchar', default: null })
  ImageURL: string;

  @Column({ type: 'varchar', default: null })
  Product_Identifier: string;

  @Column({ type: 'int', default: 0 })
  ScaleNumber: number;

  @ManyToOne(() => User, (user) => user.foodActivityLogRealTime)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @ManyToOne(() => Family, (family) => family.foodActivityLogRealTime)
  @JoinColumn({ name: 'FamilyId' })
  family: Family;

  @ManyToOne(
    () => ShoppingListProduct,
    (shoppingListProduct) => shoppingListProduct.foodActivityLogRealTime,
  )
  @JoinColumn({ name: 'ShoppingListProductId' })
  shoppingListProduct: ShoppingListProduct;

  @ManyToOne(() => Hub, (hub) => hub.shoppingListInitialProduct)
  @JoinColumn({ name: 'HubId' })
  hub: Hub;
}
