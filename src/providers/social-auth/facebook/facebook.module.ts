import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FacebookProviderService } from './facebook.service';

@Module({
  imports: [HttpModule],
  providers: [FacebookProviderService],
  exports: [FacebookProviderService],
})
export class FacebookProviderModule {}
