import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { Feedback } from './entities/feedback.entity';
import { MailProviderModule } from 'src/providers/mail/mail.module';
import { MailConfigModule } from 'src/config/mail/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback]),
    MailProviderModule,
    MailConfigModule,
  ],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
