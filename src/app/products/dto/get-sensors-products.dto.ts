import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class GetSensorsProductsDto {
  /**
   * Id of family (Required Role: User)
   */
  @IsNotEmpty()
  familyId: number;

  /**
   * showByStatus in app setting (0 or 1). if 0 then returns all products, otherwise returns based on "Need to buy" and "In Good Shape"
   */
  @IsNotEmpty()
  showByStatus: number;
}
export class SensorProducts {
  Id: number;
  RootWeight: number;
  scaleUnique: string;
  HasProduct: boolean;
  ImageURL: string;
  Name: string;
  OrderBy: number;
  AddToFMPantry: number;
  sensorISDamaged: boolean;
  sensorNotSetup: boolean;
  ActualQuantityPre: number;
  convertedWeight: string;
  convertWeightGrams: number;
  Favorite: string;
  ShoppingListId: number;
  Price: number;
  Product_Identifier: string;
  DataSource: string;
  ScaleNumber: number;
  PreviousWeight: number;
  Quantity: number;
  QuantityMeasure: string;
  DateCreated: Date;
  DateUpdated: Date;
  Active: number;
  HubId: number;
  InitialWeight: number;
  WeightDaily: number;
  Weight: number;
  Food: string;
  State: number;
  Aisle: string;
  Store: string;
  Comments: string;
  VendorProductId: string;
  isReset: boolean;
  isOldProduct: boolean;
  DisplayQuantity: number;
  ActualQuantity: number;
  HubName: string;
}
export class ScaleList {
  showAsScales: boolean;
  ShoppingListId: number;
  scalesReporting: number;
  ImagePrevList: Array<any>;
  HubId: number;
  SortOrder: number;
  Name: string;
  showRefresh: boolean;
  isRefreshing: boolean;
  isShowListRefreshing: boolean;
  ProductList: Array<SensorProducts>;
  visible: string;
  HubCreation: number;
  HubIP: string;
  WifiName: string;
}
export class GetSensorsProductsResponseDto {
  @Type(() => ScaleList)
  ScaleList: Array<ScaleList>;
  TotalScales: number;
  TotalHubs: number;
  UpdateType: string;
  LocalData: boolean;
}
