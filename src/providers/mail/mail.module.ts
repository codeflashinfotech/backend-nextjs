import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailProviderService } from './mail.service';
import { AppConfigModule } from 'src/config/app/config.module';
import { MailConfigModule } from 'src/config/mail/config.module';
import { MailConfigService } from 'src/config/mail/config.service';

@Global()
@Module({
  imports: [
    AppConfigModule,
    MailConfigModule,
    MailerModule.forRootAsync({
      imports: [MailConfigModule],
      useFactory: async (mailConfigService: MailConfigService) => ({
        transport: mailConfigService.MAIL_TRANSPORT,
        defaults: {
          from: mailConfigService.MAIL_FROM,
        },
      }),
      inject: [MailConfigService],
    }),
  ],
  providers: [MailProviderService],
  exports: [MailProviderService],
})
export class MailProviderModule {}
