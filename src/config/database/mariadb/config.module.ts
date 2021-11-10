import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { MariadbConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, MariadbConfigService],
  exports: [ConfigService, MariadbConfigService],
})
export class MariadbConfigModule {}
