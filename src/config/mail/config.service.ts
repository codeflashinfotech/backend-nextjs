import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfigService {
  constructor(private configService: ConfigService) {}

  get MAIL_TRANSPORT(): string {
    return this.configService.get<string>('Mail.MAIL_TRANSPORT');
  }

  get MAIL_FROM(): string {
    return this.configService.get<string>('Mail.MAIL_FROM');
  }

  get MAIL_SUPPORT(): string {
    return this.configService.get<string>('Mail.MAIL_SUPPORT');
  }
}
