import { IsEnum, IsNotEmpty } from 'class-validator';
import { FeedbackCreateSuccessEnum, Type } from '../feedbacks.enum';

export class CreateFeedbackDto {
  /**
   * Feedback type.
   */
  @IsEnum(Type)
  @IsNotEmpty()
  type: Type;

  /**
   * Text of feedback.
   * @example 'This is my feedback'
   */
  @IsNotEmpty()
  text: string;
}

export class CreateFeedbackResponseDto {
  /**
   * Success response.
   */
  message: FeedbackCreateSuccessEnum;
}
