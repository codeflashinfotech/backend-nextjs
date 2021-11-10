import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { AWSConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        S3_ACCESS_KEY_ID: Joi.string().required(),
        S3_SECRET_ACCESS_KEY: Joi.string().required(),
        S3_REGION: Joi.string().required(),
        S3_AVATAR_BUCKET: Joi.string().required(),
        S3_INITIAL_PRODUCT_IMAGE_BUCKET: Joi.string().required(),
        S3_PRODUCT_IMAGE_BUCKET: Joi.string().required(),
        S3_BASE_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AWSConfigService],
  exports: [ConfigService, AWSConfigService],
})
export class AWSConfigModule {}
