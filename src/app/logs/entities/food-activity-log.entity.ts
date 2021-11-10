import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Family } from '../../families/entities/family.entity';
import { Hub } from '../../systems/entities/hub.entity';
import { ShoppingListProduct } from '../../systems/entities/shopping-list-products.entity';
import { User } from '../../users/users.entity';

@Entity('FoodActivityLog')
export class FoodActivityLog {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'longtext', default: '0', nullable: false })
  ActivityData: string;

  @Column({ type: 'varchar', length: 50, default: '0', nullable: false })
  PreviousWeight: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  Date_Created: string;

  @Column({ type: 'varchar', length: 50, default: '0', nullable: false })
  Weight: string;

  @Column({ type: 'int', default: 1, nullable: false })
  Active: number;

  @Column({ type: 'int', default: 0 })
  ActivityType: number;

  @Column({ type: 'varchar', length: 100, default: null })
  FoodName: string;

  @Column({ type: 'varchar', length: 500, default: null })
  ImageURL: string;

  @Column({ type: 'varchar', length: 100, default: null })
  Product_Identifier: string;

  @Column({ type: 'int', default: -1 })
  ScaleNumber: number;

  @ManyToOne(() => User, (user) => user.foodActivityLogs)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @ManyToOne(() => Family, (family) => family.foodActivityLogs)
  @JoinColumn({ name: 'FamilyId' })
  family: User;

  @ManyToOne(
    () => ShoppingListProduct,
    (shoppingListProduct) => shoppingListProduct.foodActivityLogs,
  )
  @JoinColumn({ name: 'ShoppingListProductId' })
  shoppingListProduct: ShoppingListProduct;

  @ManyToOne(() => Hub, (hub) => hub.foodActivityLogs)
  @JoinColumn({ name: 'HubId' })
  hub: Hub;
}
