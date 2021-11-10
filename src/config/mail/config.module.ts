import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { MailConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        MAIL_TRANSPORT: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
        MAIL_SUPPORT: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, MailConfigService],
  exports: [ConfigService, MailConfigService],
})
export class MailConfigModule {}
