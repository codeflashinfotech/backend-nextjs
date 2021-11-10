import { CommonEntity } from 'src/shared/entity/common.entity';
import { Column, Entity } from 'typeorm';

@Entity('krogerauths')
export class KrogerAuth extends CommonEntity {
  @Column()
  familyId: number;

  @Column()
  refresh_token: string;

  @Column({ type: 'bigint' })
  expires_in: number;

  @Column({ length: 1000 })
  access_token: string;

  @Column()
  token_type: string;
}
