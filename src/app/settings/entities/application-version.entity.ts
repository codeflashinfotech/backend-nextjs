import { CommonEntity } from 'src/shared/entity/common.entity';
import { Column, Entity } from 'typeorm';
import { AppOS } from '../settings.enum';

@Entity('application-version')
export class ApplicationVersion extends CommonEntity {
  @Column()
  version: string;

  @Column({
    type: 'enum',
    enum: AppOS,
    default: AppOS.ANDROID,
    unique: true,
  })
  app: AppOS;
}
