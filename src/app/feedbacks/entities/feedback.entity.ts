import { CommonEntity } from 'src/shared/entity/common.entity';
import { Type } from '../feedbacks.enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/users.entity';

@Entity('feedbacks')
export class Feedback extends CommonEntity {
  @Column({
    type: 'enum',
    enum: Type,
    default: Type.Bug,
  })
  type: Type;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.feedbacks, { nullable: false })
  user: User;
}
