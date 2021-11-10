import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hub } from './hub.entity';

@Entity('ShoppingListHub')
export class ShoppingListHub {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ default: null })
  AppHubName: string;

  @Column({ type: 'longtext', nullable: true })
  ProductList: string;

  @Column({ default: null })
  HubAppId: string;

  @ManyToOne(() => Hub, (hub) => hub.shoppingListHubs)
  @JoinColumn({ name: 'HubId' })
  hub: Hub;

  @Column({ default: 1 })
  Active: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  DateCreated: string;
}
