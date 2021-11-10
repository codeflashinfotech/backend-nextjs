import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { AddActivityLogDec, LogDec } from './logs.decorator';
import {
  AddActivityLogBodyDto,
  AddActivityLogResponseDto,
  LogDto,
  LogResponseDto,
} from './dto';
import { LogsService } from './logs.service';
import { AddActivityLogSuccessEnum, LogSuccessEnum } from './logs.enum';
import { REQUEST } from '@nestjs/core';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('logs')
@Controller('v1/logs')
export class LogsController {
  @Inject(REQUEST) private req;

  constructor(private logService: LogsService) {}

  @Post()
  @LogDec()
  async log(@Body() bodyDto: LogDto): Promise<LogResponseDto> {
    await this.logService.createLog(
      bodyDto.type,
      bodyDto.logData,
      bodyDto.deviceOs,
      bodyDto.extraData,
      bodyDto.sessionId,
    );
    return { message: LogSuccessEnum.Message };
  }

  @Post('add-activity')
  @AddActivityLogDec()
  async addActivityLog(
    @Body() bodyDto: AddActivityLogBodyDto,
  ): Promise<AddActivityLogResponseDto> {
    await this.logService.addActivityLog(this.req.user.id, bodyDto);
    return { message: AddActivityLogSuccessEnum.Message };
  }
}
