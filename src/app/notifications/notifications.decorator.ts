import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { BadRequestDto, UnauthorizedDto } from 'src/shared/dto';
import {
  CreateTokenDto,
  CreateTokenFailureDto,
  CreateTokenResponseDto,
} from './dto';

export function TokenPostDec() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiBody({ type: CreateTokenDto }),
    ApiOperation({
      summary: 'Create User device token',
      description: '',
    }),
    ApiCreatedResponse({
      type: CreateTokenResponseDto,
      description: 'User device token created.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: CreateTokenFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}
