import { Inject, Injectable } from '@nestjs/common';
import { to } from 'await-to-js';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { HttpLoggerService } from 'src/shared/module/logger/http-logger.service';
import {
  IOAuth,
  ISocialAuthMethods,
  IUserInfo,
} from '../social-auth.interface';
import { OAUTH2CLIENT } from './google.const';
@Injectable()
export class GoogleProviderService implements ISocialAuthMethods {
  constructor(
    @Inject(OAUTH2CLIENT)
    private oAuth2Client: OAuth2Client,
    private httpLoggerService: HttpLoggerService,
  ) {}

  async auth(googleAuthDto: IOAuth): Promise<IUserInfo> {
    this.httpLoggerService.debug(
      'getting ticket from google',
      googleAuthDto,
      GoogleProviderService.name,
    );
    const [ticketError, ticket] = await to(
      this.oAuth2Client.verifyIdToken({
        idToken: googleAuthDto.idToken,
      }),
    );
    this.httpLoggerService.error(
      'error in getting ticket from google',
      ticketError,
      GoogleProviderService.name,
    );

    const payload: TokenPayload = ticket.getPayload();
    const userInfo: IUserInfo = {
      email: payload.email,
      fullName: payload.name,
      avatar: payload.picture,
      emailActive: true,
    };
    return userInfo;
  }
}
