import { User } from 'src/app/users/users.entity';
import { CommonEntity } from 'src/shared/entity/common.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

@Entity('devicetokens')
@Index(
  'unique_user_id_device_token',
  (deviceToken: DeviceToken) => [deviceToken.user, deviceToken.token],
  { unique: true },
)
export class DeviceToken extends CommonEntity {
  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.deviceTokens)
  user: User;
}
