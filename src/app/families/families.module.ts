import { FamiliesWebsocketGateway } from './families.gateway';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesService } from './families.service';
import { FamiliesUsersService } from './families-users.service';
import { FamiliesController } from './families.controller';
import { Family } from './entities/family.entity';
import { FamilyUser } from './entities/family-user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Family, FamilyUser])],
  controllers: [FamiliesController],
  providers: [FamiliesService, FamiliesUsersService, FamiliesWebsocketGateway],
  exports: [FamiliesService, FamiliesUsersService],
})
export class FamiliesModule {}
