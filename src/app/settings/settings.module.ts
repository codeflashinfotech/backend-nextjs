import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SettingsConfigModule } from 'src/config/settings/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationVersion } from './entities/application-version.entity';
import { AWSConfigModule } from 'src/config/aws/config.module';

@Module({
  imports: [
    SettingsConfigModule,
    AWSConfigModule,
    TypeOrmModule.forFeature([ApplicationVersion]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
