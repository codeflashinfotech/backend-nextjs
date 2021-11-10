import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { to } from 'await-to-js';
import * as qs from 'qs';
import { firstValueFrom } from 'rxjs';
import { HttpLoggerService } from 'src/shared/module/logger/http-logger.service';
import {
  IOAuth,
  ISocialAuthMethods,
  IUserInfo,
} from '../social-auth.interface';
@Injectable()
export class FacebookProviderService implements ISocialAuthMethods {
  constructor(
    private httpService: HttpService,
    private httpLoggerService: HttpLoggerService,
  ) {}

  async auth(facebookAuthDto: IOAuth): Promise<IUserInfo> {
    const urlParams = qs.stringify({
      access_token: facebookAuthDto.idToken,
      fields: 'email,name,picture',
    });
    const url = `https://graph.facebook.com/me?${urlParams}`;
    this.httpLoggerService.debug(
      'getting payload from facebook',
      url,
      FacebookProviderService.name,
    );
    const [payloadError, payload] = await to(
      firstValueFrom(this.httpService.get(url)),
    );
    this.httpLoggerService.error(
      'error in getting payload',
      payloadError,
      FacebookProviderService.name,
    );
    return {
      email: payload.data.email,
      fullName: payload.data.name,
      avatar: payload.data.picture.data.url,
      emailActive: true,
    } as IUserInfo;
  }
}
