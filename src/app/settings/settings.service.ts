import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  GetImagesBaseDataResponseDto,
  InsertAppVersionDto,
  InsertAppVersionResponseDto,
  GetAppVersionResponseDto,
  GetApiVersionResponseDto,
} from './dto';
import { SettingsConfigService } from 'src/config/settings/config.service';
import { ApplicationVersion } from './entities/application-version.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppOS } from './settings.enum';
import { AWSConfigService } from 'src/config/aws/config.service';

@Injectable()
export class SettingsService {
  constructor(
    private settingsConfigService: SettingsConfigService,
    private awsConfigService: AWSConfigService,
    @InjectRepository(ApplicationVersion)
    private applicationVersionRepository: Repository<ApplicationVersion>,
  ) {}

  /**
   * @ControllerService
   * @desc get s3 base data to fetch images in app with this data
   * */
  getImageBaseData(): GetImagesBaseDataResponseDto {
    return {
      s3BaseUrl: this.awsConfigService.S3_BASE_URL,
      s3AavatarBucket: this.awsConfigService.S3_AVATAR_BUCKET,
      s3ProductImageBucket: this.awsConfigService.S3_PRODUCT_IMAGE_BUCKET,
      s3InitialProductImageBucket:
        this.awsConfigService.S3_INITIAL_PRODUCT_IMAGE_BUCKET,
    };
  }

  getApiVersion(): GetApiVersionResponseDto {
    const apiVersion = this.settingsConfigService.API_VERSION;
    const [major, minor, patch] = apiVersion.split('.');
    return { major: Number(major), minor: Number(minor), patch: Number(patch) };
  }

  async getApplicationVersion(app: string): Promise<GetAppVersionResponseDto> {
    try {
      const appVersion = await this.applicationVersionRepository.findOne({
        where: { app: AppOS[app.toUpperCase()] },
        select: ['version'],
      });
      if (appVersion) return { version: appVersion.version };
      else return { version: '' };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async insertApplicationVersion(
    appVersion: InsertAppVersionDto,
  ): Promise<InsertAppVersionResponseDto> {
    if (appVersion.secretKey !== this.settingsConfigService.SECRET_KEY) {
      throw new UnauthorizedException();
    }

    try {
      const { version, app } = appVersion;
      const newAppVersion = new ApplicationVersion();
      const currentAppVersion = await this.applicationVersionRepository.findOne(
        {
          app: app,
        },
      );
      if (currentAppVersion) {
        currentAppVersion.version = version;
        const result = await this.applicationVersionRepository.save(
          currentAppVersion,
        );
        return {
          version: result.version,
          app: result.app,
        };
      } else {
        newAppVersion.app = AppOS[app.toUpperCase()];
        newAppVersion.version = version;
        const result = await this.applicationVersionRepository.save(
          newAppVersion,
        );
        return {
          version: result.version,
          app: result.app,
        };
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
