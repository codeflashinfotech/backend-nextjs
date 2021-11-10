import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfigModule } from 'src/config/auth/config.module';
import { AuthConfigService } from 'src/config/auth/config.service';
import { AppleProviderService } from './apple.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [AuthConfigModule],
      useFactory: async (authConfigService: AuthConfigService) => ({
        secret: authConfigService.JWT_SECRET,
      }),
      inject: [AuthConfigService],
    }),
  ],
  providers: [AppleProviderService],
  exports: [AppleProviderService],
})
export class AppleProviderModule {}
