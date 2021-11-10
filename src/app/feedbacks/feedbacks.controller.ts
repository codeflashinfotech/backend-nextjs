import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackPostDec } from './feedbacks.decorator';
import { FeedbackCreateSuccessEnum } from './feedbacks.enum';
import { REQUEST } from '@nestjs/core';

@ApiTags('feedbacks')
@Controller('v1/feedbacks')
export class FeedbacksController {
  constructor(
    private readonly feedbacksService: FeedbacksService,
    @Inject(REQUEST) private req,
  ) {}

  @Post()
  @FeedbackPostDec()
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    await this.feedbacksService.create(createFeedbackDto, this.req.user.id);
    return {
      message: FeedbackCreateSuccessEnum.Message,
    };
  }
}
