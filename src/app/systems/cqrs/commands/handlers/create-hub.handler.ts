import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Hub } from 'src/app/systems/entities/hub.entity';
import { Repository } from 'typeorm';
import { HubCreatedEvent } from '../../events/impl/hub-created.event';
import { CreateHubCommand } from '../impl/create-hub.command';

@CommandHandler(CreateHubCommand)
export class CreateHubCommandHandler
  implements ICommandHandler<CreateHubCommand>
{
  constructor(
    @InjectRepository(Hub)
    private hubsRepository: Repository<Hub>,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateHubCommand) {
    const { hubAppId, appHubName, familyId, userId } = command;
    await this.hubsRepository.update(
      { HubAppId: hubAppId },
      { HubCreation: 0 },
    );

    if (familyId == undefined) return;

    this.eventBus.publish(
      new HubCreatedEvent(hubAppId, appHubName, familyId, userId),
    );
  }
}
