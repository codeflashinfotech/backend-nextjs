import { Family } from 'src/app/families/entities/family.entity';
import { User } from 'src/app/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('FavoriteFoods')
export class FavoriteFoods {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ default: null })
  Product_Identifier: string;

  @Column({ type: 'varchar', length: 50 })
  DataSource: string;

  @Column({ type: 'longtext' })
  Food: string;

  @Column({ type: 'varchar', length: 1000 })
  ImageURL: string;

  @Column({ type: 'varchar', length: 1000 })
  Comments: string;

  @Column({ type: 'int', default: 1 })
  State: number;

  @Column({ type: 'varchar', length: 1000 })
  FoodName: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  Date_Created: string;

  @Column({ type: 'int', default: 0 })
  Quantity: number;

  @Column({ default: '' })
  Store: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  Aisle: string;

  @Column({ type: 'double', default: 0 })
  Price: number;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  VendorProductId: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  VendorProviderName: string;

  @ManyToOne(() => User, (user) => user.favoriteFoods)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @ManyToOne(() => Family, (family) => family.favoriteFoods)
  @JoinColumn({ name: 'FamilyId' })
  family: Family;
}
