import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailConfigService } from 'src/config/mail/config.service';
import { MailProviderService } from 'src/providers/mail/mail.service';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private feedbacksRepository: Repository<Feedback>,
    private mailProviderService: MailProviderService,
    private mailConfigService: MailConfigService,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto, userId): Promise<void> {
    await this.feedbacksRepository.insert({
      ...createFeedbackDto,
      user: { id: userId },
    });
    await this.mailProviderService.sendEmail(
      this.mailConfigService.MAIL_SUPPORT,
      'PantryOn Feedbacks',
      `
        <div>Feedback Type: <b>${createFeedbackDto.type}</b></div>
        <div>Feedback Message: <b>${createFeedbackDto.text}</b></div>
      `,
    );
  }
}
