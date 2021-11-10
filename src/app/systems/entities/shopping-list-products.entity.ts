import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FoodActivityLog } from '../../logs/entities/food-activity-log.entity';
import { FoodActivityLogRealTime } from './food-activity-log-real-time.entity';
import { Hub } from './hub.entity';
import { ShoppingList } from './shopping-list.entity';

@Entity('ShoppingListProducts')
export class ShoppingListProduct {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ default: null })
  Name: string;

  @ManyToOne(
    () => ShoppingList,
    (shoppingList) => shoppingList.shoppingListProducts,
  )
  @JoinColumn({ name: 'ShoppingListId' })
  shoppingList: ShoppingList;

  @Column({ type: 'float', default: -1 })
  WeightDaily: number;

  @Column({ default: null })
  ImageURL: string;

  @Column({ type: 'double', default: 0 })
  Price: number;

  @Column({ default: null })
  Product_Identifier: string;

  @Column({ default: null })
  DataSource: string;

  @Column({ default: 0, nullable: true })
  ScaleNumber: number;

  @Column({ type: 'double', default: 0, nullable: true })
  PreviousWeight: number;

  @Column({ default: 1 })
  Quantity: number;

  @Column({ default: 'Item' })
  QuantityMeasure: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  DateCreated: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  DateUpdated: string;

  @Column({ default: 1 })
  Active: number;

  @ManyToOne(() => Hub, (hub) => hub.shoppingListHubs)
  @JoinColumn({ name: 'HubId' })
  hub: Hub;

  @Column({ type: 'double', default: -1 })
  Weight: number;

  @Column({ default: 0 })
  SelectedWeightIndex: number;

  @Column({ type: 'longtext', nullable: true })
  Food: string;

  @Column({ nullable: true, default: 0 })
  State: number;

  @Column({ nullable: true })
  Aisle: string;

  @Column({ nullable: true })
  Store: string;

  @Column({ nullable: true })
  Comments: string;

  @Column({ type: 'float', nullable: true, default: -1 })
  InitialWeight: number;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  VendorProductId: string;

  @Column({ nullable: false, default: false })
  isReset: boolean;

  @Column({ nullable: false, default: true })
  isOldProduct: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  VendorProviderName: string;

  @OneToMany(
    () => FoodActivityLog,
    (foodActivityLog) => foodActivityLog.shoppingListProduct,
  )
  foodActivityLogs: FoodActivityLog[];

  @OneToMany(
    () => FoodActivityLogRealTime,
    (foodActivityLogRealTime) => foodActivityLogRealTime.shoppingListProduct,
  )
  foodActivityLogRealTime: FoodActivityLogRealTime[];
}
