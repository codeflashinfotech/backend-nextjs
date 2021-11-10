import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shadowReplication')
export class ShadowReplication {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'longtext', default: '0' })
  ShadowData: string;

  @Column({ type: 'varchar', length: 100, default: '0' })
  HubId: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  DateTimeCreated: string;

  @Column({ type: 'varchar', length: 50, default: null })
  Temprature: string;

  @Column({ type: 'varchar', length: 200, default: null })
  HubAppId: string;

  @Column({ type: 'varchar', length: 50, default: null })
  RequestId: string;

  @Column({ type: 'varchar', length: 50, default: null })
  UpdateType: string;
}
