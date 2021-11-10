import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { KrogerConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        KROGER_CLIENT_ID: Joi.string().required(),
        KROGER_CLIENT_SECRET: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, KrogerConfigService],
  exports: [ConfigService, KrogerConfigService],
})
export class KrogerConfigModule {}
