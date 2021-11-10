import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Log')
export class Log {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int', default: 0 })
  EventId: number;

  @Column({ type: 'varchar', length: 8000, default: null })
  Description: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  DataTimeCreated: string;

  @Column({ type: 'longtext', default: null })
  Data: string;

  @Column({ type: 'varchar', length: 50, default: null })
  HubAppId: string;

  @Column({ type: 'varchar', length: 100, default: null })
  RequestId: string;

  @Column({ type: 'varchar', length: 50, default: null })
  SessionId: string;
}
