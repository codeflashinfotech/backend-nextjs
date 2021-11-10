import { CommonEntity } from 'src/shared/entity/common.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from '../../users/users.entity';
import { Family } from './family.entity';
import { FamilyRole } from '../families.enum';

@Entity('families_users')
@Index(
  'unique_user_id_family_id',
  (familyUser: FamilyUser) => [familyUser.user, familyUser.family],
  { unique: true },
)
export class FamilyUser extends CommonEntity {
  @Column({
    type: 'enum',
    enum: FamilyRole,
    default: FamilyRole.Admin,
  })
  role: FamilyRole;

  @Column({ default: true, nullable: true })
  isConfirmed: boolean;

  @Column({ default: true })
  isCreator: boolean;

  @ManyToOne(() => User, (user) => user.familyUsers)
  user: User;

  @ManyToOne(() => Family, (family) => family.familyUsers)
  family: Family;
}
