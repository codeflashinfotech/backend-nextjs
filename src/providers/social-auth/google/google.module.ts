import { Module } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthConfigModule } from 'src/config/auth/config.module';
import { AuthConfigService } from 'src/config/auth/config.service';
import { OAUTH2CLIENT } from './google.const';

import { GoogleProviderService } from './google.service';

@Module({
  imports: [AuthConfigModule],
  providers: [
    GoogleProviderService,
    {
      provide: OAUTH2CLIENT,
      useFactory: (authConfigService: AuthConfigService) => {
        const CLIENT_ID = authConfigService.GOOGLE_CLIENT_ID;
        return new OAuth2Client(CLIENT_ID);
      },
      inject: [AuthConfigService],
    },
  ],
  exports: [GoogleProviderService],
})
export class GoogleProviderModule {}
