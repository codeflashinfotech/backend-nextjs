import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { KrogerProviderModule } from './kroger/kroger.module';
import { VendorProviderService } from './vendors.service';

@Module({
  imports: [HttpModule, KrogerProviderModule],
  providers: [VendorProviderService],
  exports: [VendorProviderService],
})
export class VendorsProviderModule {}
