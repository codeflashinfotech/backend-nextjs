import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from 'src/config/app/config.module';
import { AuthConfigModule } from 'src/config/auth/config.module';
import { AuthConfigService } from 'src/config/auth/config.service';
import { SocialAuthProviderModule } from 'src/providers/social-auth/social-auth.module';
import { FamiliesModule } from '../families/families.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpJwtAuthGuard } from './passport/context-jwt-auth-guards/http-jwt-auth.guard';
import { WsJwtAuthGuard } from './passport/context-jwt-auth-guards/ws-jwt-auth.guard';
import { JwtStrategy } from './passport/jwt.strategy';
import { LocalStrategy } from './passport/local.strategy';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [AuthConfigModule],
      useFactory: async (authConfigService: AuthConfigService) => ({
        secret: authConfigService.JWT_SECRET,
      }),
      inject: [AuthConfigService],
    }),
    FamiliesModule,
    SocialAuthProviderModule,
    AppConfigModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AuthConfigService,
    HttpJwtAuthGuard,
    WsJwtAuthGuard,
  ],
  controllers: [AuthController],
  exports: [HttpJwtAuthGuard, WsJwtAuthGuard],
})
export class AuthModule {}
