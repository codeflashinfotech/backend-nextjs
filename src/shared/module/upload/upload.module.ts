import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { UploadService } from './upload.service';

@Module({
  imports: [AwsSdkModule.forFeatures([S3])],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
