import { Family } from 'src/app/families/entities/family.entity';
import { User } from 'src/app/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShoppingListInitialProduct } from './shopping-list-initial-product.entity';
import { ShoppingListProduct } from './shopping-list-products.entity';

@Entity('ShoppingList')
export class ShoppingList {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ default: null })
  Name: string;

  @Column({ type: 'longtext' })
  ProductList: string;

  @ManyToOne(() => User, (user) => user.shoppingLists)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Column({ default: 1 })
  Active: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  DateCreated: string;

  @ManyToOne(() => Family, (family) => family.shoppingLists)
  @JoinColumn({ name: 'FamilyId' })
  family: User;

  @OneToMany(
    () => ShoppingListProduct,
    (shoppingListProducts) => shoppingListProducts.shoppingList,
  )
  shoppingListProducts: ShoppingListProduct[];

  @OneToMany(
    () => ShoppingListInitialProduct,
    (shoppingListInitialProduct) => shoppingListInitialProduct.shoppingList,
  )
  shoppingListInitialProduct: ShoppingListInitialProduct[];
}
