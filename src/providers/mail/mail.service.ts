import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { AppConfigService } from 'src/config/app/config.service';
import { MailConfigService } from 'src/config/mail/config.service';
import { EmailErrorEnum, EmailErrorMsgEnum } from './mail.enum';

@Injectable()
export class MailProviderService {
  constructor(
    private mailerService: MailerService,
    private appConfigService: AppConfigService,
    private mailConfigService: MailConfigService,
  ) {}

  async sendEmail(to, subject, html) {
    try {
      const from = this.mailConfigService.MAIL_FROM;
      await this.mailerService.sendMail({
        to,
        from,
        subject,
        html,
      });
    } catch (error) {
      if (this.appConfigService.MODE !== 'DEV') {
        throw new UnprocessableEntityException({
          errorCode: EmailErrorEnum.EmailSentFail,
          message: EmailErrorMsgEnum.EmailSentFail,
        });
      }
    }
  }
}
