import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KrogerConfigModule } from 'src/config/vendors/kroger/config.module';
import { KrogerAuth } from './entities/krogerauths.entity';
import { KrogerProviderService } from './kroger.service';

@Module({
  imports: [
    HttpModule,
    KrogerConfigModule,
    TypeOrmModule.forFeature([KrogerAuth]),
  ],
  providers: [KrogerProviderService],
  exports: [KrogerProviderService, KrogerConfigModule],
})
export class KrogerProviderModule {}
