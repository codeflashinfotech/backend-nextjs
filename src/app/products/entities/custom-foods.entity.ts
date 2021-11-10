import { Family } from 'src/app/families/entities/family.entity';
import { User } from 'src/app/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('CustomFoods')
export class CustomFoods {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ default: null })
  Product_Identifier: string;

  @Column({ type: 'varchar', length: 50, default: null })
  DataSource: string;

  @Column({ type: 'longtext', default: null })
  Food: string;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  ImageURL: string;

  @Column({ type: 'varchar', length: 1000, default: null })
  Comments: string;

  @Column({ type: 'int', default: 1 })
  State: number;

  @Column({ type: 'varchar', length: 1000, default: null })
  FoodName: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  Date_Created: string;

  @Column({ type: 'int', default: 0 })
  Quantity: number;

  @Column({ default: '' })
  Store: string;

  @ManyToOne(() => Family, (family) => family.customFoods)
  @JoinColumn({ name: 'FamilyId' })
  family: User;

  @ManyToOne(() => User, (user) => user.shoppingLists)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Column({ type: 'varchar', length: 50, default: '' })
  Aisle: string;

  @Column({ type: 'double', default: 0 })
  Price: number;
}
