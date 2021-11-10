import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { InsertResult, MoreThan, Repository } from 'typeorm';
import { FoodActivityLog } from './entities/food-activity-log.entity';
import { AddActivityLogBodyDto } from './dto';
import { ShoppingListProduct } from '../systems/entities/shopping-list-products.entity';
import { FavoriteFoods } from '../products/entities/favorite.foods.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
    @InjectRepository(FoodActivityLog)
    private foodActivityLogService: Repository<FoodActivityLog>,
  ) {}

  /**
   * TODO : remove console logs in production
   * @controllerService
   * @description create logs
   * @param {number} eventId event Id
   * @param {string} desc description
   * @param {string} data stringify data
   * @param {string} requestId request Id
   * @param {string} hubAppId hub app id
   * @return {Promise<void>} nothing to return
   */
  async createLog(
    eventId: number,
    desc: string,
    data: string,
    requestId: string,
    hubAppId: string,
  ): Promise<void> {
    console.log(eventId, desc, data, requestId, hubAppId);
    await this.logRepository.insert({
      EventId: eventId,
      Description: desc,
      Data: data,
      RequestId: requestId,
      HubAppId: hubAppId,
    });
  }

  /**
   * @controllerService
   * @description create ActivityLog (food activity)
   * @param {number} userId id of authorised user
   * @param {object} body  AddActivityLogBodyDto data
   * @return {Promise<InsertResult>} insert result data
   */
  async addActivityLog(
    userId: number,
    body: AddActivityLogBodyDto,
  ): Promise<InsertResult> {
    return await this.foodActivityLogService.insert({
      user: { id: userId },
      ...body,
    });
  }

  async addProductToActivityLog(
    product: ShoppingListProduct,
    userId: number,
    familyId: number,
    ActivityType: number,
  ) {
    const ActivityData = JSON.stringify(product);
    const PreviousWeight = product.PreviousWeight;
    const Weight = product.Weight;
    const Active = product.Active;
    const FoodName = product.Name;
    const ImageURL = product.ImageURL;
    const Product_Identifier = product.Product_Identifier;
    const UserId = userId;
    const FamilyId = familyId;
    const ShoppingListProductId = product.shoppingList?.Id;
    const ScaleNumber = product.ScaleNumber;
    const HubId = product.hub?.Id;
    const foodActivityLog = {
      ActivityData,
      PreviousWeight,
      Weight,
      Active,
      ActivityType,
      FoodName,
      ImageURL,
      Product_Identifier,
      family: { id: FamilyId },
      shoppingListProduct: { Id: ShoppingListProductId },
      ScaleNumber,
      hub: { Id: HubId },
    };
    ShoppingListProductId != undefined
      ? (foodActivityLog.shoppingListProduct = { Id: ShoppingListProductId })
      : delete foodActivityLog.shoppingListProduct;

    HubId != undefined
      ? (foodActivityLog.hub = { Id: HubId })
      : delete foodActivityLog.hub;
    this.addActivityLog(UserId, foodActivityLog);
  }

  async addFavoriteProductToActivityLog(
    product: FavoriteFoods,
    userId: number,
    familyId: number,
    ActivityType: number,
  ) {
    const ActivityData = JSON.stringify(product);

    const FoodName = product.FoodName;
    const ImageURL = product.ImageURL;
    const Product_Identifier = product.Product_Identifier;
    const UserId = userId;
    const FamilyId = familyId;

    const foodActivityLog = {
      ActivityData,
      PreviousWeight: '',
      Weight: '',
      Active: '',
      ActivityType,
      FoodName,
      ImageURL,
      Product_Identifier,
      family: { id: FamilyId },
      shoppingListProduct: { Id: 0 },
      ScaleNumber: 0,
      hub: { Id: 0 },
    };

    delete foodActivityLog.PreviousWeight;
    delete foodActivityLog.Weight;
    delete foodActivityLog.Active;
    delete foodActivityLog.shoppingListProduct;
    delete foodActivityLog.ScaleNumber;
    delete foodActivityLog.hub;

    this.addActivityLog(UserId, foodActivityLog);
  }
}
