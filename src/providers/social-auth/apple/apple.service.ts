import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { to } from 'await-to-js';
import * as jwks from 'jwks-rsa';
import * as lodash from 'lodash';
import { HttpLoggerService } from 'src/shared/module/logger/http-logger.service';
import {
  IAppleJwtPayload,
  IOAuth,
  ISocialAuthMethods,
  IUserInfo,
} from '../social-auth.interface';

@Injectable()
export class AppleProviderService implements ISocialAuthMethods {
  appleJwskClient = jwks({
    jwksUri: 'https://appleid.apple.com/auth/keys',
  });
  constructor(
    private jwtService: JwtService,
    private httpLoggerService: HttpLoggerService,
  ) {}

  private getApplePublicKey(keyId): Promise<string> {
    return new Promise((resolve) => {
      this.appleJwskClient.getSigningKey(keyId, (err, key) => {
        if (err) return resolve(null);
        resolve(key.getPublicKey());
      });
    });
  }

  /**
   * @desc get jwt token from body ( comes from appleId servers ) and it most verify by public key ,
   * for getting public key we use Jwsk to get it by keyId (it exist in jwt -> header -> kid)
   * */
  async auth(appleAuthDto: IOAuth): Promise<IUserInfo> {
    const decodedJwt = this.jwtService.decode(appleAuthDto.idToken, {
      complete: true,
    });
    const keyId = lodash.get(decodedJwt, 'header.kid', null);

    this.httpLoggerService.debug(
      'getApplePublicKey',
      keyId,
      AppleProviderService.name,
    );
    const [publicKeyError, publicKey] = await to(this.getApplePublicKey(keyId));
    this.httpLoggerService.error(
      'error in getting publicKey from apple',
      publicKeyError,
      AppleProviderService.name,
    );
    this.httpLoggerService.debug(
      'verifying token',
      appleAuthDto.idToken,
      AppleProviderService.name,
    );
    const [payloadError, payload] = await to(
      this.jwtService.verifyAsync(appleAuthDto.idToken, {
        secret: publicKey,
        algorithms: ['RS256'],
      }),
    );
    this.httpLoggerService.error(
      'error in verifying token',
      payloadError,
      AppleProviderService.name,
    );
    return {
      email: (payload as IAppleJwtPayload).email,
      emailActive: true,
      fullName: appleAuthDto.fullName,
    };
  }
}
