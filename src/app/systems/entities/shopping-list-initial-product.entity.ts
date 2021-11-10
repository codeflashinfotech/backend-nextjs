import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hub } from './hub.entity';
import { ShoppingList } from './shopping-list.entity';

@Entity('ShoppingListInitialProducts')
export class ShoppingListInitialProduct {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', default: null })
  Name: string;

  @Column({ type: 'float', default: -1 })
  WeightDaily: number;

  @Column({ type: 'varchar', default: null })
  ImageURL: string;

  @Column({ type: 'double', default: 0, nullable: false })
  Price: string;

  @Column({ type: 'varchar', default: null })
  Product_Identifier: string;

  @Column({ type: 'varchar', default: null })
  DataSource: string;

  @Column({ type: 'int', default: 0 })
  ScaleNumber: number;

  @Column({ type: 'float', default: 0 })
  PreviousWeight: number;

  @Column({ type: 'int', default: 1, nullable: false })
  Quantity: number;

  @Column({ type: 'varchar', default: 'Item', nullable: false })
  QuantityMeasure: string;

  @Column({ type: 'int', default: 1, nullable: false })
  Active: number;

  @Column({ type: 'float', default: -1 })
  Weight: number;

  @Column({ type: 'int', default: 0 })
  SelectedWeightIndex: number;

  @Column({ type: 'longtext', default: null })
  Food: string;

  @Column({ type: 'int', default: 0 })
  State: number;

  @Column({ type: 'varchar', default: null })
  Aisle: string;

  @Column({ type: 'varchar', default: null })
  Store: string;

  @Column({ type: 'varchar', default: null })
  Comments: string;

  @Column({ type: 'float', default: -1 })
  InitialWeight: number;

  @ManyToOne(() => Hub, (hub) => hub.shoppingListInitialProduct)
  @JoinColumn({ name: 'HubId' })
  hub: Hub;

  @ManyToOne(
    () => ShoppingList,
    (shoppingList) => shoppingList.shoppingListInitialProduct,
  )
  @JoinColumn({ name: 'ShoppingListId' })
  shoppingList: ShoppingList;
}
