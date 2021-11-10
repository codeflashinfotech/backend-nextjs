import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadRequestDto, ForbiddenDto, UnauthorizedDto } from '../../shared/dto';
import { AddActivityLogResponseDto, LogResponseDto } from './dto';

export function LogDec() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Log',
      description: 'Save logs',
    }),
    ApiOkResponse({
      type: LogResponseDto,
      description: 'success message for logs',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body Or Query properties are invalid.',
    }),
  );
}

export function AddActivityLogDec() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Add activity',
      description: 'Save activity logs',
    }),
    ApiOkResponse({
      type: AddActivityLogResponseDto,
      description: 'success message for logs',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body Or Query properties are invalid.',
    }),
  );
}
