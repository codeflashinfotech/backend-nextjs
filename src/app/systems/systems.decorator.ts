import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FamilyRoles } from 'src/shared/decorator/family-api.decorator';
import { BadRequestDto, ForbiddenDto, UnauthorizedDto } from 'src/shared/dto';
import { FamilyRole } from '../families/families.enum';
import { Public } from '../../shared/decorator/public-api.decorator';
import {
  CreateSystemDto,
  CreateSystemFailureDto,
  CreateSystemResponseDto,
  DeleteFamilySystemResponseDto,
  GetSystemDto,
  ProcessShadowUpdateDtoResponse,
  ProcessShadowUpdateFailureDto,
  UpdateFamilySystemDto,
  UpdateFamilySystemResponseDto,
} from './dto';

export function SystemPostDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.Admin),
    ApiBearerAuth(),
    ApiBody({ type: CreateSystemDto }),
    ApiOperation({
      summary: 'Create a new system',
      description: '',
    }),
    ApiCreatedResponse({
      type: CreateSystemResponseDto,
      description: 'Create a new system',
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
      description: 'Bad request. Body properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: CreateSystemFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function MySystemGetDec() {
  return applyDecorators(
    ApiBearerAuth(),
    FamilyRoles(FamilyRole.User),
    ApiParam({ name: 'familyId', description: 'id of family' }),
    ApiOperation({
      summary: "Get list of given family's hubs",
      description:
        "Get list of given family's hubs. (my family). If HubCreation=0 it means the hub is ready to go.",
    }),
    ApiOkResponse({
      type: [GetSystemDto],
      description: 'list of hubs.',
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

export function FamilySystemDeleteDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.Admin),
    ApiBearerAuth(),
    ApiParam({ name: 'hubId', description: 'id of hub (system)' }),
    ApiParam({ name: 'familyId', description: 'id of family' }),
    ApiOperation({
      summary: 'Delete System',
      description: 'user should be admin of family',
    }),
    ApiOkResponse({
      type: DeleteFamilySystemResponseDto,
      description: 'System deleted successfully. ',
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
      description: 'Bad request. Body properties are invalid.',
    }),
  );
}

export function FamilySystemPutDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.Admin),
    ApiBearerAuth(),
    ApiParam({ name: 'hubId', description: 'id of hub (system)' }),
    ApiParam({ name: 'familyId', description: 'id of family' }),
    ApiBody({ type: UpdateFamilySystemDto }),
    ApiOperation({
      summary: 'Update System',
      description: 'user should be admin of family',
    }),
    ApiOkResponse({
      type: UpdateFamilySystemResponseDto,
      description: 'System updated successfully.',
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
      description: 'Bad request. Body properties are invalid.',
    }),
  );
}

export function ShadowUpdatePostDec() {
  return applyDecorators(
    ApiBearerAuth(),
    Public(),
    ApiOperation({
      summary: 'Update Shadow System (Call by device)',
      description:
        'Call by device to Update Sensors value no need to use in frontend',
    }),
    ApiOkResponse({
      type: ProcessShadowUpdateDtoResponse,
      description: 'Shadow update Process completed',
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
      description: 'Bad request. Body properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: ProcessShadowUpdateFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}
