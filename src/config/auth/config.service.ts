import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private configService: ConfigService) {}

  get GOOGLE_CLIENT_ID(): string {
    return this.configService.get<string>('Auth.GOOGLE_CLIENT_ID');
  }
  get JWT_SECRET(): string {
    return this.configService.get<string>('Auth.JWT_SECRET');
  }
}
