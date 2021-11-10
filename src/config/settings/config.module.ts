import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { SettingsConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        API_VERSION: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, SettingsConfigService],
  exports: [ConfigService, SettingsConfigService],
})
export class SettingsConfigModule {}
