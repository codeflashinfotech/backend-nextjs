import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { UploadModule } from '../../shared/module/upload/upload.module';
import { AWSConfigModule } from 'src/config/aws/config.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), UploadModule, AWSConfigModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
