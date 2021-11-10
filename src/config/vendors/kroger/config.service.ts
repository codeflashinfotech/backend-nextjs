import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KrogerConfigService {
  constructor(private configService: ConfigService) {}

  get CLIENT_ID(): string {
    return this.configService.get<string>('Kroger.CLIENT_ID');
  }
  get CLIENT_SECRET(): string {
    return this.configService.get<string>('Kroger.CLIENT_SECRET');
  }
}
