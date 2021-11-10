import { Module } from '@nestjs/common';
import { AuthConfigModule } from 'src/config/auth/config.module';
import { AppleProviderModule } from './apple/apple.module';
import { FacebookProviderModule } from './facebook/facebook.module';
import { GoogleProviderModule } from './google/google.module';
import { SocialAuthProviderService } from './social-auth.service';

@Module({
  imports: [
    AuthConfigModule,
    GoogleProviderModule,
    FacebookProviderModule,
    AppleProviderModule,
  ],
  providers: [SocialAuthProviderService],
  exports: [SocialAuthProviderService],
})
export class SocialAuthProviderModule {}
