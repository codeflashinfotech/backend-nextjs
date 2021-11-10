import { Injectable } from '@nestjs/common';
import to from 'await-to-js';
import {
  Brackets,
  getManager,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { SensorProducts } from '../../../app/products/dto';
import { FMPantry, WeightStat } from '../../../app/products/products.enum';
import { ShoppingListProductRawDataInterface } from '../../../app/products/products.interface';
import { UnitConvert } from '../../utils/unit-convert.util';

type ISensorsProduct = SensorProducts;

@Injectable()
export class SensorProductsListService {
  constructor(private unitConvert: UnitConvert) {}

  async getAllSensorsProducts(
    AppHubName: string,
    where?: string | Brackets | ((qb: SelectQueryBuilder<unknown>) => string),
    whereParam?: ObjectLiteral,
  ): Promise<Array<ISensorsProduct>> {
    const manager = getManager();
    const [err, shoppingListProduct]: [
      Error,
      ShoppingListProductRawDataInterface[],
    ] = await to(
      manager
        .createQueryBuilder('ShoppingListProducts', 'SLP')
        .leftJoinAndSelect(
          'FavoriteFoods',
          'FF',
          ' SLP.Product_Identifier=FF.Product_Identifier',
        )
        .where('SLP.HubId <> -1 AND SLP.Weight <> :sensorStatus ', {
          sensorStatus: WeightStat.NotSetup,
        })
        .andWhere(where, whereParam)
        .getRawMany(),
    );

    return shoppingListProduct.map((slp) =>
      this.sensorProductObject(slp, AppHubName),
    );
  }

  private sensorProductObject(
    slp: ShoppingListProductRawDataInterface,
    AppHubName: string,
  ): ISensorsProduct {
    if (!slp) {
      throw new Error('empty slp not allowed.');
    }
    const isSensorDamaged = slp.SLP_Weight === WeightStat.Damaged;
    const sensorNotSetup = slp.SLP_Weight === WeightStat.NotSetup;
    const isSensorOk = !isSensorDamaged && !sensorNotSetup;
    const productPercent = (slp.SLP_Weight / slp.SLP_InitialWeight) * 100;
    const ActualQuantityPre =
      slp.SLP_InitialWeight > 0 && slp.SLP_Quantity > 0
        ? Math.trunc(
            slp.SLP_Weight / (slp.SLP_InitialWeight / slp.SLP_Quantity),
          )
        : -1;

    return {
      Id: slp.SLP_Id,
      Name: slp.SLP_Name ? slp.SLP_Name : 'Please add a Product',
      ShoppingListId: slp.SLP_ShoppingListId,
      ImageURL: slp.SLP_Name ? slp.SLP_ImageURL : null,
      Active: slp.SLP_Active,
      ActualQuantity: this.calculateActualQuantity(
        ActualQuantityPre,
        slp.SLP_Quantity,
      ),
      Aisle: slp.SLP_Aisle ? slp.SLP_Aisle : '',
      Comments: slp.SLP_Comments,
      DataSource: slp.SLP_DataSource ? slp.SLP_DataSource : '',
      DateCreated: slp.SLP_DateCreated,
      DateUpdated: slp.SLP_DateUpdated,
      DisplayQuantity:
        ActualQuantityPre > slp.SLP_Quantity
          ? slp.SLP_Quantity
          : slp.SLP_Quantity,
      Food: slp.SLP_Food,
      HubId: slp.SLP_HubId,
      HubName: AppHubName.replace(/'|"/, "\\'"),
      InitialWeight: slp.SLP_InitialWeight,
      PreviousWeight: slp.SLP_PreviousWeight,
      Price: slp.SLP_Price,
      Product_Identifier: slp.SLP_Product_Identifier,
      Quantity: slp.SLP_Quantity,
      QuantityMeasure: slp.SLP_QuantityMeasure,
      ScaleNumber: slp.SLP_ScaleNumber,
      State: slp.SLP_State,
      Store: slp.SLP_Store ? slp.SLP_Store : '',
      VendorProductId: slp.SLP_VendorProductId,
      Weight: slp.SLP_Weight,
      WeightDaily: slp.SLP_WeightDaily,
      isOldProduct: !!slp.SLP_isOldProduct,
      isReset: !!slp.SLP_isReset,
      RootWeight: productPercent,
      scaleUnique: `${slp.SLP_ScaleNumber}-${slp.SLP_HubId}`,
      HasProduct: !!slp.SLP_ScaleNumber,
      sensorISDamaged: isSensorDamaged,
      sensorNotSetup,
      OrderBy: this.calculateOrderBy(
        slp,
        isSensorDamaged,
        sensorNotSetup,
        productPercent,
      ),
      AddToFMPantry: this.calculateAddToFMPantry(slp),
      ActualQuantityPre,
      convertedWeight:
        isSensorOk && slp.SLP_Weight !== 0
          ? `${this.unitConvert.convertWeight(slp.SLP_Weight, 'LB').lbs} lbs, ${
              this.unitConvert.convertWeight(slp.SLP_Weight, 'LB').oz
            } oz`
          : '0 oz',
      convertWeightGrams: isSensorOk
        ? this.unitConvert.convertWeight(slp.SLP_Weight, 'G')
        : 0,
      Favorite: slp.FF_Product_Identifier ? slp.FF_Product_Identifier : '-1',
    };
  }

  private calculateActualQuantity(ActualQuantityPre, Quantity): number {
    if (ActualQuantityPre === -1) return Quantity;
    if (ActualQuantityPre < 1) return 1;
    return ActualQuantityPre;
  }

  private calculateOrderBy(
    slp: ShoppingListProductRawDataInterface,
    isDamaged: boolean,
    isNotSetup: boolean,
    productPercent: number,
  ): number {
    if (!slp.SLP_Name || slp.SLP_Name === 'Please add a Product') return 5;
    if (isDamaged || isNotSetup) return 7;
    if (!slp.SLP_WeightDaily && !slp.SLP_Weight) return 0;
    if (!slp.SLP_Weight) return 4;
    if (
      slp.SLP_Weight === slp.SLP_InitialWeight ||
      slp.SLP_InitialWeight < slp.SLP_Weight
    )
      return 3;
    if (productPercent === 0) return 1;
    if (productPercent > 60) return 3;
    if (productPercent > 30) return 2;
    if (productPercent > 0) return 0;
  }

  private calculateAddToFMPantry({
    SLP_WeightDaily: nightlyWight,
    SLP_InitialWeight: initialWeight,
    SLP_Name: productName,
    SLP_Weight: weight,
  }: ShoppingListProductRawDataInterface): number {
    const nightlyProductUpdatePercent = (nightlyWight / initialWeight) * 100;
    if (!productName) return FMPantry.UnNamed;

    if (
      nightlyWight === WeightStat.Damaged ||
      nightlyWight === WeightStat.NotSetup
    )
      return FMPantry.OutOfWhatINeed;

    if (!initialWeight) return FMPantry.Needed;

    if (!nightlyWight) return FMPantry.OutOfWhatINeed;
    if (weight === initialWeight) return FMPantry.OutOfWhatINeed;

    if (nightlyProductUpdatePercent === 0) return FMPantry.Needed;
    if (nightlyProductUpdatePercent > 60) return 0;
    if (nightlyProductUpdatePercent > 30) return FMPantry.RunningLow;
    if (nightlyProductUpdatePercent > 0) return FMPantry.Needed;
  }
}
