import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitConvert } from 'src/shared/utils/unit-convert.util';
import { Repository } from 'typeorm';
import { FoodActivityLog } from '../logs/entities/food-activity-log.entity';
import {
  FoodActivityLogHubScaleResponseDto,
  FoodActivityLogProductFamilyResponseDto,
} from './dto';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(FoodActivityLog)
    private foodActivityLogRepository: Repository<FoodActivityLog>,
    private unitConvert: UnitConvert,
  ) {}

  convertWeight(histories: FoodActivityLogProductFamilyResponseDto[]);
  convertWeight(histories: FoodActivityLogHubScaleResponseDto[]);
  convertWeight(
    histories,
  ):
    | FoodActivityLogProductFamilyResponseDto[]
    | FoodActivityLogHubScaleResponseDto[] {
    for (const history of histories) {
      history.ConvertWeightGrams = this.unitConvert.convertWeight(
        Number(history.Weight),
        'G',
      );
      history.ConvertedWeight = this.unitConvert.convertWeight(
        Number(history.Weight),
        'LB',
      );
    }
    return histories;
  }

  async getFamilyHistory(familyid: number): Promise<FoodActivityLog[]> {
    const result: FoodActivityLog[] =
      await this.foodActivityLogRepository.query(
        `select * from FoodActivityLog where FamilyId=${familyid} order by Date_Created desc LIMIT 100`,
      );
    return result;
  }

  async getFamilyDistinctHistory(familyid: number) {
    const result = await this.foodActivityLogRepository.query(
      `select DISTINCT REPLACE(FoodName,'''','\`') AS FoodName, ImageURL,Product_Identifier from FoodActivityLog where FamilyId=${familyid} order by Date_Created desc`,
    );
    return result;
  }

  async getProductFamilyHistory(
    days: number,
    familyId: number,
    product_Identifier: string,
  ): Promise<FoodActivityLogProductFamilyResponseDto[]> {
    const result = await this.foodActivityLogRepository.query(
      `select  FAL.Id,REPLACE(FAL.ActivityData ,'''','') As ActivityData,FAL.Weight, FAL.Active, FAL.ActivityType, REPLACE(FAL.FoodName,'''','') AS FoodName,FAL.ImageURL,FAL.Product_Identifier,FAL.Date_Created,FAL.UserId,FAL.FamilyId,FAL.ShoppingListProductId,FAL.HubId, FA.ActivityId,FA.ActivityType,FA.ActivityName ,  'collapse' AS visible from FoodActivityLog FAL inner join FoodActivity FA on FAL.ActivityType = FA.ActivityId where FamilyId=${familyId} and Product_Identifier='${product_Identifier}'  AND (DATE(Date_Created) >= DATE(NOW())  + INTERVAL -${days} DAY) order by Date_Created desc LIMIT 100`,
    );
    return this.convertWeight(
      result as FoodActivityLogProductFamilyResponseDto[],
    );
  }

  async getProductUserHistory(userId: number, product_Identifier: string) {
    const result = await this.foodActivityLogRepository.query(
      `select FAL.Id,REPLACE(FAL.ActivityData ,'''','') As ActivityData,FAL.Weight, FAL.Active, FAL.ActivityType, REPLACE(FAL.FoodName,'''','') AS FoodName,FAL.ImageURL,FAL.Product_Identifier,FAL.Date_Created,FAL.UserId,FAL.FamilyId,FAL.ShoppingListProductId,FAL.HubId, FA.ActivityId,FA.ActivityType,FA.ActivityName from FoodActivityLog FAL inner join FoodActivity FA on FAL.ActivityType = FA.ActivityId where UserId=${userId} and Product_Identifier='${product_Identifier}' order by Date_Created desc LIMIT 100`,
    );
    return result;
  }

  async getHubScaleHistory(
    hubId: number,
    scaleNumber: number,
    days: number,
  ): Promise<FoodActivityLogHubScaleResponseDto[]> {
    const result = await this.foodActivityLogRepository.query(
      `select FAL.Id,REPLACE(FAL .ActivityData ,'''','') As ActivityData,FAL.Weight, FAL.Active, FAL.ActivityType, REPLACE(FAL.FoodName,'''','') AS FoodName,FAL.ImageURL,FAL.Product_Identifier,FAL.Date_Created,FAL.UserId,FAL.FamilyId,FAL.ShoppingListProductId,FAL.HubId, FA.ActivityId,FA.ActivityType,FA.ActivityName from FoodActivityLog FAL inner join FoodActivity FA on FAL.ActivityType = FA.ActivityId where HubId=${hubId} and ScaleNumber=${scaleNumber}  AND (DATE(Date_Created) >= DATE(NOW())  + INTERVAL -${days} DAY) order by Date_Created desc LIMIT 100`,
    );
    return this.convertWeight(result as FoodActivityLogHubScaleResponseDto[]);
  }

  async getHubHistory(hubId: number) {
    const result = await this.foodActivityLogRepository.query(
      `select Distinct ScaleNumber,  'collapse' AS visible  from FoodActivityLog  where HubId=${hubId} order by Date_Created desc`,
    );
    return result;
  }
}
