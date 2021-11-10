import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetImagesBaseDataResponseDto,
  GetAppVersionResponseDto,
  InsertAppVersionDto,
  InsertAppVersionResponseDto,
  GetApiVersionResponseDto,
} from './dto';
import {
  getApiVersionDec,
  getAppVersionDec,
  ImageSettingGetDec,
  insertAppVersionDec,
} from './settings.decorator';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@Controller('v1/settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('image')
  @ImageSettingGetDec()
  getImageBaseData(): GetImagesBaseDataResponseDto {
    return this.settingsService.getImageBaseData();
  }

  @getApiVersionDec()
  @Get('api-version')
  getApiVersion(): GetApiVersionResponseDto {
    return this.settingsService.getApiVersion();
  }

  @getAppVersionDec()
  @Get('app-version')
  getAppVersion(@Query('app') app: string): Promise<GetAppVersionResponseDto> {
    return this.settingsService.getApplicationVersion(app);
  }

  @Post('app-version')
  @insertAppVersionDec()
  insertAppVersion(
    @Body() appVersion: InsertAppVersionDto,
  ): Promise<InsertAppVersionResponseDto> {
    return this.settingsService.insertApplicationVersion(appVersion);
  }
}
