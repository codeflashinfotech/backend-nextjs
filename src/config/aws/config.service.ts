import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AWSConfigService {
  constructor(private configService: ConfigService) {}
  get S3_ACCESS_KEY_ID(): string {
    return this.configService.get<string>('AWS.S3_ACCESS_KEY_ID');
  }

  get S3_SECRET_ACCESS_KEY(): string {
    return this.configService.get<string>('AWS.S3_SECRET_ACCESS_KEY');
  }

  get S3_REGION(): string {
    return this.configService.get<string>('AWS.S3_REGION');
  }

  get S3_AVATAR_BUCKET(): string {
    return this.configService.get<string>('AWS.S3_AVATAR_BUCKET');
  }

  get S3_INITIAL_PRODUCT_IMAGE_BUCKET(): string {
    return this.configService.get<string>(
      'AWS.S3_INITIAL_PRODUCT_IMAGE_BUCKET',
    );
  }

  get S3_PRODUCT_IMAGE_BUCKET(): string {
    return this.configService.get<string>('AWS.S3_PRODUCT_IMAGE_BUCKET');
  }

  get S3_BASE_URL(): string {
    return this.configService.get<string>('AWS.S3_BASE_URL');
  }
}
