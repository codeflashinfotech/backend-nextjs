import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class GetRunningLowProductsDto {
  /**
   * Id of family (Required Role: User)
   */
  @IsNotEmpty()
  familyId: number;
}
class ScaleList {
  showAsScales: boolean;
  ShoppingListId: number;
  scalesReporting: number;
  ImagePrevList: Array<any>;
  HubId: number;
  SortOrder: number;
  Name: string;
  showRefresh: boolean;
  isRefreshing: boolean;
  ShowIcons: boolean;
  isShowListRefreshing: boolean;
  ProductList: Array<any>;
  visible: string;
}
export class GetRunningLowProductsResponseDto {
  @Type(() => ScaleList)
  ScaleList: Array<ScaleList>;

  GoodShape: number;
  LocalData: boolean;
}
