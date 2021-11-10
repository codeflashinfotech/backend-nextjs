import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FamilyRoles } from 'src/shared/decorator/family-api.decorator';
import { BadRequestDto, ForbiddenDto, UnauthorizedDto } from 'src/shared/dto';
import { FamilyRole } from '../families/families.enum';
import {
  FoodActivityLogDistinctFamilyGetResponseDto,
  FoodActivityLogGetResponseDto,
  FoodActivityLogHubResponseDto,
} from './dto';

export function getFamilyHistoryDec() {
  return applyDecorators(
    ApiBearerAuth(),
    FamilyRoles(FamilyRole.User),
    ApiParam({ name: 'familyId', description: 'id of family' }),
    ApiOperation({
      summary: 'Get history based on familyid',
      description: '',
    }),
    ApiOkResponse({
      type: [FoodActivityLogGetResponseDto],
      description: 'Get list of FoodActivityLog.',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Properties are invalid.',
    }),
  );
}

export function getFamilyDistinctHistoryDec() {
  return applyDecorators(
    ApiBearerAuth(),
    FamilyRoles(FamilyRole.User),
    ApiParam({ name: 'familyId', description: 'id of family' }),
    ApiOperation({
      summary: 'Get distinct history based on familyid',
      description: '',
    }),
    ApiOkResponse({
      type: [FoodActivityLogDistinctFamilyGetResponseDto],
      description: 'Get list of FoodActivityLog.',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Properties are invalid.',
    }),
  );
}

export function getProductFamilyHistoryDec() {
  return applyDecorators(
    ApiBearerAuth(),
    FamilyRoles(FamilyRole.User),
    ApiOperation({
      summary: 'Get history based on familyid, product_indentifier and days',
      description: '',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Properties are invalid.',
    }),
  );
}

export function getProductUserHistoryDec() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get history based on userid, product_indentifier',
      description: '',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Properties are invalid.',
    }),
  );
}

export function getHubScaleHistory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get history based on hubid, scalenumber, days',
      description: '',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Properties are invalid.',
    }),
  );
}

export function getHubHistoryDec() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: 'hubId', description: 'id of hub' }),
    ApiOperation({
      summary: 'Get history based on hubid',
      description: '',
    }),
    ApiOkResponse({
      type: [FoodActivityLogHubResponseDto],
      description: 'Get list of FoodActivityLog.',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Properties are invalid.',
    }),
  );
}
