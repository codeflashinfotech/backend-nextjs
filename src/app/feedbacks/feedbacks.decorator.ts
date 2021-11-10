import { applyDecorators } from '@nestjs/common';
import { BadRequestDto, UnauthorizedDto } from 'src/shared/dto';
import { CreateFeedbackDto, CreateFeedbackResponseDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function FeedbackPostDec() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiBody({ type: CreateFeedbackDto }),
    ApiOperation({
      summary: 'Create a new feedback',
      description: '',
    }),
    ApiCreatedResponse({
      type: CreateFeedbackResponseDto,
      description: 'Create a new feedback',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body properties are invalid.',
    }),
  );
}
