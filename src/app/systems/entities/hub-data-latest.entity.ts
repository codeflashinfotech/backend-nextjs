import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hub } from './hub.entity';

@Entity('HubDataLatest')
export class HubDataLatest {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'longtext', nullable: true })
  ShadowData: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  DateTimeCreated: string;

  @Column({ default: null })
  Temprature: string;

  @Column({ default: null })
  HubAppId: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  DateTimeUpdated: string;

  @Column({ type: 'varchar', length: 200, default: null })
  HubId: string;

  @Column({ type: 'longtext', nullable: true })
  FoodOnScales: string;

  @ManyToOne(() => Hub, (hub) => hub.hubDataLatests)
  @JoinColumn({ name: 'HubAppId' })
  hub: Hub;
}
