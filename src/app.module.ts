import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { existsSync } from 'fs';
import { AwsSdkModule } from 'nest-aws-sdk';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { FamilyRolesGuard } from './app/auth/passport/family-roles.guard';
import { JwtAuthGuard } from './app/auth/passport/jwt-auth.guard';
import { FamiliesModule } from './app/families/families.module';
import { FeedbacksModule } from './app/feedbacks/feedbacks.module';
import { HistoriesModule } from './app/histories/histories.module';
import { LogsModule } from './app/logs/logs.module';
import { NotificationsModule } from './app/notifications/notifications.module';
import { ProductsModule } from './app/products/products.module';
import { SettingsModule } from './app/settings/settings.module';
import { ShoppingListsModule } from './app/shopping-lists/shopping-lists.module';
import { SystemsModule } from './app/systems/systems.module';
import { UsersModule } from './app/users/users.module';
import { AppConfigModule } from './config/app/config.module';
import { AWSConfigModule } from './config/aws/config.module';
import { AWSConfigService } from './config/aws/config.service';
import { MailProviderModule } from './providers/mail/mail.module';
import { HttpExceptionFilter } from './shared/filter/http-exception.filter';
import { CustomLoggerModule } from './shared/module/logger/logger.module';
import { UploadModule } from './shared/module/upload/upload.module';
import { SensorProductsListModule } from './shared/module/sensor-products-list/sensor-products-list.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', ''),
    }),
    FirebaseAdminModule.forRootAsync({
      useFactory: async () => {
        if (!existsSync('pantryon-firebase.json')) {
          throw new Error(
            'pantryon-firebase.json does not exist in the root of project',
          );
        }
        return {
          credential: admin.credential.cert('pantryon-firebase.json'),
        };
      },
    }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [AWSConfigModule],
        useFactory: (awsConfigService: AWSConfigService) => {
          return {
            credentials: {
              secretAccessKey: awsConfigService.S3_SECRET_ACCESS_KEY,
              accessKeyId: awsConfigService.S3_ACCESS_KEY_ID,
            },
            region: awsConfigService.S3_REGION,
          };
        },
        inject: [AWSConfigService],
      },
    }),
    UsersModule,
    AuthModule,
    FeedbacksModule,
    FamiliesModule,
    MailProviderModule,
    NotificationsModule,
    SystemsModule,
    ProductsModule,
    ShoppingListsModule,
    LogsModule,
    UploadModule,
    SettingsModule,
    AppConfigModule,
    CustomLoggerModule,
    HistoriesModule,
    SensorProductsListModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: FamilyRolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
