import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import * as _ from 'lodash';
import { SensorProductsListService } from '../../../../../shared/module/sensor-products-list/sensor-products-list.service';
import { ISensorsProductsUpdatedEvent } from '../../cqrs.interface';
import { SensorsProductsUpdatedEvent } from '../../events/impl/sensors-products-updated.event';
import { UpdateSensorsProductsCommand } from '../impl/update-sensors-products.command';

@CommandHandler(UpdateSensorsProductsCommand)
export class UpdateSensorsProductsCommandHandler
  implements ICommandHandler<UpdateSensorsProductsCommand>
{
  constructor(
    private eventBus: EventBus,
    private sensorProductListService: SensorProductsListService,
  ) {}

  async execute(
    command: UpdateSensorsProductsCommand,
  ): Promise<ISensorsProductsUpdatedEvent> {
    const { hubId, appHubName, familyId } = command;
    const showByNoStatusList = {
      showAsScales: false,
      ShoppingListId: -109,
      scalesReporting: 0,
      ImagePrevList: [],
      HubId: hubId,
      SortOrder: 1,
      ShowIcons: true,
      Name: 'Needed',
      showRefresh: true,
      isRefreshing: false,
      isShowListRefreshing: false,
      ProductList: [],
      visible: 'collapse',
    } as ISensorsProductsUpdatedEvent;

    const finalResult =
      await this.sensorProductListService.getAllSensorsProducts(
        appHubName,
        "HubId = :HubId AND DATE_FORMAT( DateUpdated , '%Y-%m-%d %H:%i') IN ( SELECT MAX(DATE_FORMAT( DateUpdated , '%Y-%m-%d %H:%i')) FROM ShoppingListProducts )",
        { HubId: hubId },
      );

    const sensorProducts = _.orderBy(finalResult, ['DateUpdated'], ['desc']);
    sensorProducts.map((sp) => {
      showByNoStatusList.ProductList.push(sp);
    });

    if (familyId)
      this.eventBus.publish(
        new SensorsProductsUpdatedEvent(showByNoStatusList, familyId),
      );
    return showByNoStatusList;
  }
}
