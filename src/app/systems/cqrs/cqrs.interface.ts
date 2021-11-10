import { SensorProducts } from '../../products/dto';

export interface IHubCreatedEvent {
  Action: string;
  HubId: number;
  ActionMessage: IActionMessage;
  UserId: number;
  FamilyId: number;
  Room: string;
}

export interface IActionMessage {
  Action: string;
  Type: string;
  Message: string;
  HubAppId: string;
  Messagedata: string;
}

export interface ISensorsProductsUpdatedEvent {
  HubId: number;
  ImagePrevList: any[];
  Name: string;
  ProductList: ISensorsProduct[];
  ShoppingListId: number;
  ShowIcons: boolean;
  SortOrder: number;
  isRefreshing: boolean;
  isShowListRefreshing: boolean;
  scalesReporting: number;
  showAsScales: boolean;
  showRefresh: boolean;
  visible: string;
}

type ISensorsProduct = SensorProducts;
