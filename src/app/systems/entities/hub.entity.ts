import { Family } from 'src/app/families/entities/family.entity';
import { User } from 'src/app/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FoodActivityLog } from '../../logs/entities/food-activity-log.entity';
import { HubDataLatest } from './hub-data-latest.entity';
import { ShoppingListHub } from './shopping-list-hub.entity';
import { ShoppingListInitialProduct } from './shopping-list-initial-product.entity';

@Entity('Hub')
export class Hub {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => User, (user) => user.hubs)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Column({ default: null })
  AppHubName: string;

  @Column({ type: 'longtext', nullable: true })
  AddressLocation: string;

  @Column({ default: 1 })
  HubActive: number;

  @Column({ default: null })
  MacAddress: string;

  @Column({ default: null })
  HubAppId: string;

  @Column({ default: 1 })
  HubCreation: number;

  @Column({ default: null })
  WifiName: string;

  @Column({ default: null })
  RefreshRate: string;

  @Column({ default: null })
  TimeZone: string;

  @Column({ default: null })
  HubIP: string;

  @ManyToOne(() => Family, (family) => family.hubs)
  family: User;

  @Column({ type: 'longtext', nullable: true })
  HubScaleFood: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  DateTimeUpdated: string;

  @Column({ default: 0 })
  HubUpdating: number;

  @Column({ default: null })
  HubVersion: string;

  @Column({ default: null })
  WifiPassword: string;

  @OneToMany(() => ShoppingListHub, (shoppingListHub) => shoppingListHub.hub)
  shoppingListHubs: ShoppingListHub[];

  @OneToMany(() => HubDataLatest, (hubDataLatest) => hubDataLatest.hub)
  hubDataLatests: HubDataLatest[];

  @OneToMany(() => FoodActivityLog, (foodActivityLog) => foodActivityLog.hub)
  foodActivityLogs: FoodActivityLog[];

  @OneToMany(
    () => ShoppingListInitialProduct,
    (shoppingListInitialProduct) => shoppingListInitialProduct.hub,
  )
  shoppingListInitialProduct: ShoppingListInitialProduct[];
}
