import { PickType } from '@nestjs/swagger';
import { FoodActivityLog } from 'src/app/logs/entities/food-activity-log.entity';

export class FoodActivityLogGetResponseDto extends PickType(FoodActivityLog, [
  'Id',
  'ActivityData',
  'PreviousWeight',
  'Weight',
  'Active',
  'ActivityType',
  'FoodName',
  'ImageURL',
  'Product_Identifier',
  'Date_Created',
  'ScaleNumber',
]) {
  'UserId': number;
  'FamilyId': number;
  'ShoppingListProductId': number;
  'HubId': number;
}

export class FoodActivityLogDistinctUserGetResponseDto {
  FoodName: string;
  ImageURL: string;
  Product_Identifier: string;
}

export class FoodActivityLogDistinctFamilyGetResponseDto {
  FoodName: string;
  ImageURL: string;
  Product_Identifier: string;
}

export class FoodActivityLogProductFamilyResponseDto extends PickType(
  FoodActivityLog,
  [
    'Id',
    'ActivityData',
    'Weight',
    'Active',
    'ActivityType',
    'FoodName',
    'ImageURL',
    'Product_Identifier',
    'Date_Created',
  ],
) {
  'UserId': number;
  'FamilyId': number;
  'ShoppingListProductId': number;
  'HubId': number;
  'ActivityId': number;
  'ActivityName': string;
  'visible': string;
  'ConvertWeightGrams': number;
  'ConvertedWeight': LBS;
}

export class LBS {
  lbs: number;
  oz: number;
}

export class FoodActivityLogProductUserResponseDto extends PickType(
  FoodActivityLog,
  [
    'Id',
    'ActivityData',
    'Weight',
    'Active',
    'ActivityType',
    'FoodName',
    'ImageURL',
    'Product_Identifier',
    'Date_Created',
  ],
) {
  'UserId': number;
  'FamilyId': number;
  'ShoppingListProductId': number;
  'HubId': number;
  'ActivityId': number;
  'ActivityName': string;
}
export class FoodActivityLogHubScaleResponseDto extends FoodActivityLogProductUserResponseDto {
  'ConvertWeightGrams': number;
  'ConvertedWeight': LBS;
}

export class FoodActivityLogHubResponseDto {
  ScaleNumber: number;
  visible: string;
}
