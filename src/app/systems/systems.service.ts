import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { to } from 'await-to-js';
import { HttpLoggerService } from 'src/shared/module/logger/http-logger.service';
import { getManager, In, InsertResult, Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { CreateHubCommand } from './cqrs/commands/impl/create-hub.command';
import { UpdateSensorsProductsCommand } from './cqrs/commands/impl/update-sensors-products.command';
import {
  CreateSystemDto,
  ProcessShadowUpdateDtoResponse,
  ProcessShadowUpdateFailureDto,
  UpdateFamilySystemDto,
} from './dto';
import { HubDataLatest } from './entities/hub-data-latest.entity';
import { Hub } from './entities/hub.entity';
import { ShadowReplication } from './entities/shadow-replication.entity';
import { ShoppingListHub } from './entities/shopping-list-hub.entity';
import { ShoppingListProduct } from './entities/shopping-list-products.entity';
import {
  CreateSystemErrorEnum,
  CreateSystemErrorMsgEnum,
  ProcessShadowUpdateSystemErrorEnum,
  ProcessShadowUpdateSystemErrorMsgEnum,
  ProcessShadowUpdateSystemSuccessEnum,
} from './systems.enum';
import {
  ICreateShadow,
  IDeviceData,
  ProcessShadowUpdateValueInterface,
  WeightOfProcessShadowUpdateValueInterface,
} from './systems.interface';
import { ShoppingListInitialProduct } from './entities/shopping-list-initial-product.entity';
import { WeightStat } from '../products/products.enum';
import { LOCKER } from './systems.const';

@Injectable()
export class SystemsService {
  constructor(
    @InjectRepository(Hub)
    private hubsRepository: Repository<Hub>,
    @InjectRepository(HubDataLatest)
    private hubDataLatestsRepository: Repository<HubDataLatest>,
    @InjectRepository(ShoppingListHub)
    private shoppingListHubsRepository: Repository<ShoppingListHub>,
    @InjectRepository(ShoppingListProduct)
    private shoppingListProductsRepository: Repository<ShoppingListProduct>,
    @InjectRepository(ShadowReplication)
    private shadowReplicationRepository: Repository<ShadowReplication>,
    @InjectRepository(ShoppingListInitialProduct)
    private shoppingListInitialProductRepository: Repository<ShoppingListInitialProduct>,
    @Inject(LOCKER)
    private locker: Array<string>,
    private logService: LogsService,
    private commandBus: CommandBus,
    private httpLoggerService: HttpLoggerService,
  ) {}


  async findHub(condition): Promise<Hub> {
    return await this.hubsRepository.findOne(condition);
  }

  async findHubs(condition): Promise<Hub[]> {
    return await this.hubsRepository.find(condition);
  }

  async createHubDataLatests(data): Promise<InsertResult> {
    return await this.hubDataLatestsRepository.insert(data);
  }

  async createShoppingListHubs(data): Promise<InsertResult> {
    return await this.shoppingListHubsRepository.insert(data);
  }

  async createHub(data): Promise<InsertResult> {
    return await this.hubsRepository.insert(data);
  }

  async createSystem(
    createSystemDto: CreateSystemDto,
    userId,
  ): Promise<number> {
    const foundHub = await this.findHub({ HubAppId: createSystemDto.HubAppId });
    if (foundHub) {
      throw new UnprocessableEntityException({
        errorCode: CreateSystemErrorEnum.HubAppIdExist,
        message: CreateSystemErrorMsgEnum.HubAppIdExist,
      });
    }
    await this.createHubDataLatests({ HubAppId: createSystemDto.HubAppId });
    const hub = await this.createHub({
      ...createSystemDto,
      user: { id: userId },
    });
    await this.createShoppingListHubs({
      AppHubName: createSystemDto.AppHubName,
      HubAppId: createSystemDto.HubAppId,
      hub: hub.identifiers[0],
    });
    return hub.identifiers[0].Id;
  }

  async deleteSystem(hubId): Promise<void> {
    await this.shoppingListHubsRepository.delete({ hub: { Id: hubId } });
    await this.shoppingListProductsRepository.delete({ hub: { Id: hubId } });
    await this.hubsRepository.delete(hubId);
  }

  async updateSystem(hubId, data: UpdateFamilySystemDto): Promise<void> {
    await this.hubsRepository.update(hubId, data);
    await this.shoppingListHubsRepository.update(
      { hub: { Id: hubId } },
      { AppHubName: data.AppHubName },
    );
  }

  private async createShadow(data: ICreateShadow): Promise<void> {
    try {
      await this.shadowReplicationRepository.insert({
        ShadowData: data.ShadowData,
        HubAppId: data.HubAppId,
        Temprature: data.Temperature,
        HubId: data.HubMac,
        RequestId: data.RequestId,
        UpdateType: data.UpdateType,
      });

      await this.hubDataLatestsRepository.update(
        { HubAppId: data.HubAppId },
        {
          ShadowData: data.ShadowData,
          Temprature: data.Temperature,
          HubId: data.HubMac,
        },
      );

      await this.hubsRepository.update(
        { HubAppId: data.HubAppId },
        { HubIP: data.HubIP, MacAddress: data.HubMac },
      );
    } catch (e) {
      this.httpLoggerService.error(
        'error in creating shadow',
        e,
        SystemsService.name,
      );
    }
  }

  /**
   * @description
   * @param
   * @return
   * @private
   * @async
   * TODO: return type,arg types
   * */
  async processDeviceData(
    value: ProcessShadowUpdateValueInterface,
    requestId: string,
  ) {
    const deviceData = this.formatDeviceData(value, requestId);
    this.httpLoggerService.debug(
      '<<<Starting to Process Device Data....>>>',
      deviceData,
      SystemsService.name,
    );

    await this.createShadow(deviceData);

    return await this.updateProductWeight(deviceData);
  }

  private formatDeviceData(
    value: ProcessShadowUpdateValueInterface,
    requestId: string,
  ): IDeviceData {
    return {
      ShadowData: JSON.stringify(value),
      RequestId: requestId,
      HubMac: value?.state?.reported?.MAC || 'MAC Not Defined',
      HubIP: value?.state?.reported?.IP || '192.168.0.40',
      HubAppId: value?.state?.reported?.UniqueID,
      Temperature: value?.state?.reported?.Temperature,
      UpdateType: value.state?.reported.UpdateType || 'RealTime',
      value,
    };
  }

  private async updateProductWeight(
    deviceData: IDeviceData,
  ): Promise<ProcessShadowUpdateDtoResponse | ProcessShadowUpdateFailureDto> {
    this.httpLoggerService.debug(
      'start to update device products...',
      deviceData,
      SystemsService.name,
    );
    const { value, HubAppId, UpdateType } = deviceData;
    const scaleList: Array<WeightOfProcessShadowUpdateValueInterface> = value
      ?.state?.reported?.Weight || [
      { ScaleNumber: 1, ScaleWeight: 0, OldWeight: 0 },
    ];

    const hubUniqueId = value.state.reported.UniqueID;

    // when user wants to add new hub to app , app create a uniqueId (hubAppId) for that hub and save it in db
    const [hubError, hubResult] = await to(
      this.hubsRepository.findOne(
        { HubActive: 1, HubAppId },
        {
          select: ['Id', 'user', 'family', 'AppHubName', 'HubCreation'],
          relations: ['family', 'user'],
        },
      ),
    );
    this.httpLoggerService.error(
      'error in finding hub',
      hubError,
      SystemsService.name,
    );

    if (!hubResult) {
      this.httpLoggerService.debug(
        `Unknown Hub. hub with uniqueId ${HubAppId} not found cant process with this hub.`,
        SystemsService.name,
      );

      throw new UnprocessableEntityException({
        errorCode: ProcessShadowUpdateSystemErrorEnum.HubNotFound,
        message: ProcessShadowUpdateSystemErrorMsgEnum.HubNotFound,
      });
    }

    console.log(
      `hubResult.HubCreation ${hubResult.HubCreation} uniq ${hubUniqueId} len ${this.locker.length}`,
    );

    if (this.locker.includes(hubUniqueId)) {
      console.log(
        `it second time hub with ${hubUniqueId} unique id send request and it will reject`,
      );
      return;
    }


    // HubCreation == 1 means not active yet
    if (hubResult.HubCreation == 1) {

      const snooze = ms => new Promise(resolve => setTimeout(resolve, 3000));

      // check if request comes twice for one hub reject it
      if (this.locker.includes(hubUniqueId)) {
        console.log(
          `it second time hub with ${hubUniqueId} unique id send request and it will reject`,
        );
        return;
      }
      // add hub to locker
      this.locker.push(hubUniqueId);
      console.log(
        `hub with ${hubUniqueId} unique id not exist in locker. add this hub in locker and request will process`,
      );
      console.log('now locker data is: ', this.locker);

      const userId = hubResult.user?.id;
      const familyId = hubResult.family?.id;

      await this.commandBus.execute(
        new CreateHubCommand(HubAppId, hubResult.AppHubName, userId, familyId),
      );

      this.httpLoggerService.debug(
        'Send socket message',
        {
          HubAppId,
          AppHubName: hubResult.AppHubName,
          userId,
          familyId,
        },
        SystemsService.name,
      );
    }

    const [shoppingListHubError, shoppingListHub] = await to(
      this.shoppingListHubsRepository.findOne(
        {
          HubAppId,
          Active: 1,
        },
        { select: ['Id'] },
      ),
    );

    this.httpLoggerService.error(
      'error in finding shoppingListHub',
      shoppingListHubError,
      SystemsService.name,
    );

    const [shoppingListProductError, shoppingListProduct] = await to(
      this.shoppingListProductsRepository.find({
        select: ['Id', 'ScaleNumber', 'shoppingList', 'Weight'],
        relations: ['hub', 'shoppingList'],
        where: {
          hub: { Id: hubResult.Id },
        },
      }),
    );

    this.httpLoggerService.error(
      'error in finding shoppingListProduct',
      shoppingListProductError,
      SystemsService.name,
    );
    await this.setInitialProduct(scaleList, hubResult, shoppingListHub.Id);
    // remove hub  from locker
    
    

    await this.unResetProduct(shoppingListProduct, scaleList);
    await this.updateSentProductData(scaleList, UpdateType, hubResult);

    const familyId: number = hubResult.family?.id;
    const hubId: number = hubResult.Id;
    const appHubName: string = hubResult.AppHubName;

    const finalList = [];

    this.httpLoggerService.debug(
      'start UpdateSensorsProducts',
      { hubId, appHubName, familyId },
      SystemsService.name,
    );
    const showByNoStatusList = await this.commandBus.execute(
      new UpdateSensorsProductsCommand(hubId, appHubName, familyId),
    );
    finalList.push(showByNoStatusList);

    const hubIndex = this.locker.indexOf(hubUniqueId);
    if (hubIndex > -1) {
      this.locker.splice(hubIndex, 1);
      console.log(
        `process ended and hub ${hubUniqueId} is remove from locker. locker data: `,
        this.locker,
      );
    }

    return { message: ProcessShadowUpdateSystemSuccessEnum.Message };
  }

  private async unResetProduct(
    shoppingListProduct: ShoppingListProduct[],
    scaleList: WeightOfProcessShadowUpdateValueInterface[],
  ) {
    const unResetProductList: number[] = [];
    shoppingListProduct.map((slp) => {
      scaleList.map((scale) => {
        if (
          slp.ScaleNumber === scale.ScaleNumber &&
          slp.Weight !== scale.ScaleWeight
        ) {
          unResetProductList.push(slp.Id);
        }
      });
    });
    await this.shoppingListProductsRepository
      .createQueryBuilder()
      .update()
      .set({ isReset: false })
      .where({
        Id: In(unResetProductList),
      })
      .execute();
  }

  private async updateSentProductData(
    scaleList: WeightOfProcessShadowUpdateValueInterface[],
    updateType: string,
    hubResult: Hub,
  ) {
    let query = '';
    let queryLog = '';
    const manager = getManager();
    scaleList.map((w) => {
      query += `UPDATE ShoppingListProducts SET PreviousWeight=Weight  WHERE ScaleNumber=${w.ScaleNumber} AND HubId=${hubResult.Id};`;
      if (updateType == 'RealTime') {
        if (w.ScaleWeight < 65534) {
          // WeightDaily is use for nightly update and calculate needed and runningLow.
          // in here we calculate WeightDaily to remove from running low and needed when product updates
          query += `UPDATE ShoppingListProducts SET Weight=${w.ScaleWeight} , WeightDaily=IF(InitialWeight <> 0,IF((WeightDaily/InitialWeight)*100 < 60 AND (${w.ScaleWeight}/InitialWeight)*100 >= 60 , 0 , WeightDaily),WeightDaily) where ScaleNumber=${w.ScaleNumber} And HubId=${hubResult.Id} ;`;
          query += `UPDATE ShoppingListProducts SET Quantity=IF(InitialWeight < Weight AND Weight!=0 AND InitialWeight <> 0 AND Quantity <> 0, cast(ceiling(Weight / (InitialWeight / Quantity)) as INT),Quantity) WHERE ScaleNumber=${w.ScaleNumber} AND HubId=${hubResult.Id};`;
          query += `UPDATE ShoppingListProducts SET InitialWeight=IF(InitialWeight < Weight, ${w.ScaleWeight},InitialWeight) where ScaleNumber=${w.ScaleNumber} And HubId=${hubResult.Id};`;
        } else {
          query += `UPDATE ShoppingListProducts SET Weight=${w.ScaleWeight} WHERE ScaleNumber=${w.ScaleNumber} AND HubId=${hubResult.Id};`;
        }
        queryLog += `INSERT INTO FoodActivityLogRealtime (ActivityData,ActivityType, FoodName,ImageURL,Product_Identifier,FamilyId,UserId,ShoppingListProductId,HubId, ScaleNumber,Weight,PreviousWeight) SELECT Food,400,SLP.Name,ImageURL,Product_Identifier,HH.FamilyId,HH.UserId,SLP.Id,SLP.HubId,ScaleNumber,Weight,PreviousWeight FROM ShoppingListProducts SLP INNER JOIN ShoppingListHub SL ON SL.Id = SLP.ShoppingListId INNER JOIN Hub HH ON SL.HubAppId = HH.HubAppId WHERE SLP.HubId=${hubResult.Id} AND ScaleNumber =${w.ScaleNumber} AND Weight!=65534 AND Name != '';`;
      } else {
        query += `UPDATE ShoppingListProducts SET WeightDaily=${w.ScaleWeight}, Weight=${w.ScaleWeight}, InitialWeight=IF(InitialWeight < Weight, ${w.ScaleWeight},InitialWeight) where ScaleNumber=${w.ScaleNumber} And HubId=${hubResult.Id};`;
        queryLog += `INSERT INTO FoodActivityLog (ActivityData,ActivityType, FoodName,ImageURL,Product_Identifier,FamilyId,UserId,ShoppingListProductId,HubId, ScaleNumber,Weight,PreviousWeight) SELECT Food,401,SLP.Name,ImageURL,Product_Identifier,HH.FamilyId,HH.UserId,SLP.Id,SLP.HubId,ScaleNumber,Weight,PreviousWeight FROM ShoppingListProducts SLP INNER JOIN ShoppingListHub SL ON SL.Id = SLP.ShoppingListId INNER JOIN Hub HH ON SL.HubAppId = HH.HubAppId WHERE SLP.HubId=${hubResult.Id} AND ScaleNumber =${w.ScaleNumber} AND Weight!=65534 AND Name != '';`;
      }
    });

    this.httpLoggerService.debug(
      'Start Update ShoppingListProducts',
      query,
      SystemsService.name,
    );

    const [queryError, queryResult] = await to(manager.query(query));

    this.httpLoggerService.error(
      'Error in Update ShoppingListProducts',
      queryError,
      SystemsService.name,
    );

    if (queryLog) {
      const [queryError, queryResult] = await to(manager.query(queryLog));
      this.httpLoggerService.error(
        'Error in queryLog',
        queryError,
        SystemsService.name,
      );
    }
  }

  private async setInitialProduct(
    weight: Array<WeightOfProcessShadowUpdateValueInterface>,
    hubResult: Hub,
    shoppingListHubId: number,
  ): Promise<void> {
    const scaleList = [...weight];
    const initialProduct =
      await this.shoppingListInitialProductRepository.find();

    for (const scale of scaleList) {
      // filter initial products . remove scaleData if product already exist for this hub
      const existedProduct = await this.shoppingListProductsRepository.findOne({
        select: ['Id', 'ScaleNumber', 'shoppingList', 'Weight'],
        relations: ['hub', 'shoppingList'],
        where: {
          hub: { Id: hubResult.Id },
          ScaleNumber: scale.ScaleNumber,
        },
      });

      if (existedProduct || scale.ScaleWeight === WeightStat.NotSetup) continue;

      if (scaleList.indexOf(scale) >= 0) {
        const {
          Name,
          ImageURL,
          Price,
          Product_Identifier,
          PreviousWeight,
          QuantityMeasure,
          Active,
          State,
        } = initialProduct.find((ip) => ip.ScaleNumber === scale.ScaleNumber);
        await this.shoppingListProductsRepository.save({
          Quantity: 0,
          Comments: 'New PantryOn Sensor',
          shoppingList: { Id: shoppingListHubId },
          ScaleNumber: scale.ScaleNumber,
          Weight: WeightStat.NotSetup,
          hub: { ...hubResult },
          Food: '',
          WeightDaily: 0,
          DataSource: '',
          Aisle: '',
          Store: '',
          InitialWeight: -1,
          Name,
          ImageURL,
          Price: Number(Price),
          Product_Identifier,
          PreviousWeight,
          QuantityMeasure,
          Active,
          State,
        });
      }
    }
  }
}
