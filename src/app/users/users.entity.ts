import { CustomFoods } from '../products/entities/custom-foods.entity';
import * as bcrypt from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';
import { CommonEntity } from 'src/shared/entity/common.entity';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm';
import { FamilyUser } from '../families/entities/family-user.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { DeviceToken } from '../notifications/entities/device-token.entity';
import { FavoriteFoods } from '../products/entities/favorite.foods.entity';
import { Hub } from '../systems/entities/hub.entity';
import { ShoppingList } from '../systems/entities/shopping-list.entity';
import { Gender } from './users.enum';
import { FoodActivityLog } from '../logs/entities/food-activity-log.entity';
import { FoodActivityLogRealTime } from '../systems/entities/food-activity-log-real-time.entity';

@Entity('users')
export class User extends CommonEntity {
  @Column()
  fullName: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  @Index({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  @Exclude()
  emailCode: number;

  @Column({ nullable: true })
  emailActive: boolean;

  @Column({ nullable: true })
  @Exclude()
  forgetPassCode: number;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  age: number;

  @Column({
    nullable: true,
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Exclude()
  private tempPassword: string;

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => FamilyUser, (familyUser) => familyUser.user)
  familyUsers: FamilyUser[];

  @OneToMany(() => DeviceToken, (deviceToken) => deviceToken.user)
  deviceTokens: DeviceToken[];

  @OneToMany(() => Hub, (hub) => hub.user)
  hubs: Hub[];

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.user)
  shoppingLists: ShoppingList[];

  @OneToMany(() => CustomFoods, (customFood) => customFood.user)
  customFoods: CustomFoods[];

  @OneToMany(() => FoodActivityLog, (foodActivityLog) => foodActivityLog.user)
  foodActivityLogs: FoodActivityLog[];

  @OneToMany(() => FavoriteFoods, (favoriteFood) => favoriteFood.user)
  favoriteFoods: FavoriteFoods[];

  @OneToMany(
    () => FoodActivityLogRealTime,
    (foodActivityLogRealTime) => foodActivityLogRealTime.user,
  )
  foodActivityLogRealTime: FoodActivityLogRealTime[];

  @AfterLoad()
  loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  toJSON() {
    return classToPlain(this);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.tempPassword !== this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
