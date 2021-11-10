import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { REQUEST } from '@nestjs/core';
import { HistoriesService } from './histories.service';
import {
  getFamilyDistinctHistoryDec,
  getFamilyHistoryDec,
  getHubHistoryDec,
  getHubScaleHistory,
  getProductFamilyHistoryDec,
  getProductUserHistoryDec,
} from './histories.decorator';
import { FoodActivityLog } from '../logs/entities/food-activity-log.entity';
import {
  FoodActivityLogProductFamilyResponseDto,
  GetProductUserHistoryQueryDto,
  GetProductFamilyHistoryQueryDto,
  FoodActivityLogProductUserResponseDto,
  GetHubScaleHistoryQueryDto,
  FoodActivityLogHubScaleResponseDto,
  FoodActivityLogHubResponseDto,
  FoodActivityLogDistinctFamilyGetResponseDto,
} from './dto';

@ApiTags('histories')
@Controller('v1/histories')
export class HistoriesController {
  constructor(
    private readonly historiesService: HistoriesService,
    @Inject(REQUEST) private request,
  ) {}

  @Get('family/:familyId')
  @getFamilyHistoryDec()
  getFamilyHistory(@Param() params): Promise<FoodActivityLog[]> {
    return this.historiesService.getFamilyHistory(params.familyId);
  }

  @Get('family/distinct/:familyId')
  @getFamilyDistinctHistoryDec()
  getFamilyDistinctHistory(
    @Param() params,
  ): Promise<FoodActivityLogDistinctFamilyGetResponseDto[]> {
    return this.historiesService.getFamilyDistinctHistory(params.familyId);
  }

  @Get('product-family')
  @getProductFamilyHistoryDec()
  getProductFamilyHistory(
    @Query() queryDto: GetProductFamilyHistoryQueryDto,
  ): Promise<FoodActivityLogProductFamilyResponseDto[]> {
    const { days, familyId, product_Identifier } = queryDto;
    return this.historiesService.getProductFamilyHistory(
      days,
      familyId,
      product_Identifier,
    );
  }

  @Get('product-user')
  @getProductUserHistoryDec()
  getProductUserHistory(
    @Query() queryDto: GetProductUserHistoryQueryDto,
  ): Promise<FoodActivityLogProductUserResponseDto[]> {
    const { product_Identifier } = queryDto;
    return this.historiesService.getProductUserHistory(
      this.request?.user?.id,
      product_Identifier,
    );
  }

  @Get('hub-scale')
  @getHubScaleHistory()
  getHubScaleHistory(
    @Query() queryDto: GetHubScaleHistoryQueryDto,
  ): Promise<FoodActivityLogHubScaleResponseDto[]> {
    const { hubId, scaleNumber, days } = queryDto;
    return this.historiesService.getHubScaleHistory(hubId, scaleNumber, days);
  }

  @Get('hub/:hubId')
  @getHubHistoryDec()
  getHubHistory(@Param() params): Promise<FoodActivityLogHubResponseDto[]> {
    return this.historiesService.getHubHistory(params.hubId);
  }
}
