import { Injectable } from '@nestjs/common';
import { AppleProviderService } from './apple/apple.service';
import { FacebookProviderService } from './facebook/facebook.service';
import { GoogleProviderService } from './google/google.service';
import { IOAuth, IUserInfo } from './social-auth.interface';

@Injectable()
export class SocialAuthProviderService {
  constructor(
    private googleProviderService: GoogleProviderService,
    private facebookProviderService: FacebookProviderService,
    private appleProviderService: AppleProviderService,
  ) {}
  async auth(providerName: string, oAuth?: IOAuth): Promise<IUserInfo> {
    try {
      return this[providerName].auth(oAuth);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
