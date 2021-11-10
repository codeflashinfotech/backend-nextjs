import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SettingsConfigService {
  constructor(private configService: ConfigService) {}

  get API_VERSION(): string {
    return this.configService.get<string>('Settings.API_VERSION');
  }

  get SECRET_KEY(): string {
    return this.configService.get<string>('Settings.SECRET_KEY');
  }
}
