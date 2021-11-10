import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import { Public } from 'src/shared/decorator/public-api.decorator';
import { CreateTokenDto, CreateTokenResponseDto } from './dto';
import { TokenPostDec } from './notifications.decorator';
import { TokenCreateSuccessEnum } from './notifications.enum';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('v1/notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private firebaseMessagingService: FirebaseMessagingService,
    @Inject(REQUEST) private req,
  ) {}

  @Post('token')
  @TokenPostDec()
  async createToken(
    @Body() body: CreateTokenDto,
  ): Promise<CreateTokenResponseDto> {
    // await this.notificationsService.createToken(body, this.req.user.id);
    return {
      message: TokenCreateSuccessEnum.Message,
    };
  }

  @Post('dev')
  // @ApiBearerAuth()
  @Public()
  // async sendNotification(@Body() body: SendNotificationDevDto) {
  async sendNotification(@Body() body) {
    console.log(body);
    return;

    const payload: admin.messaging.MessagingPayload = {
      notification: {
        body: 'Welcome',
        title: 'Hey. Welcome to PantryOn',
      },
    };
    try {
      const notif = await this.firebaseMessagingService.sendToDevice(
        body.deviceToken,
        payload,
      );
      console.log(notif);
    } catch (e) {
      console.log('notification eeeeer');
      console.log(e);
    }
  }
}
