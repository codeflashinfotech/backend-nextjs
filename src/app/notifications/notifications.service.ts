import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenDto } from './dto/create-token.dto';
import { DeviceToken } from './entities/device-token.entity';
import {
  TokenCreateErrorEnum,
  TokenCreateErrorMsgEnum,
} from './notifications.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
  ) {}

  async createToken(createTokenDto: CreateTokenDto, userId): Promise<void> {
    try {
      await this.deviceTokenRepository.insert({
        ...createTokenDto,
        user: { id: userId },
      });
    } catch (e) {
      throw new UnprocessableEntityException({
        errorCode: TokenCreateErrorEnum.DuplicateToken,
        message: TokenCreateErrorMsgEnum.DuplicateToken,
      });
    }
  }
}
