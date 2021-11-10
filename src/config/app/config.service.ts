import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
type Mode = 'DEV' | 'PROD';
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get MODE(): Mode {
    return this.configService.get<Mode>('App.MODE');
  }

  get PORT(): number {
    return Number(this.configService.get<number>('App.PORT'));
  }

  get BASE_URL(): string {
    return this.configService.get<string>('App.BASE_URL');
  }

  get DEBUG(): boolean {
    return this.configService.get<string>('App.DEBUG') === 'true';
  }
}
