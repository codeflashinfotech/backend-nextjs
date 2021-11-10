import { applyDecorators } from '@nestjs/common';
import { BadRequestDto, ForbiddenDto, UnauthorizedDto } from 'src/shared/dto';
import {
  AssignFamilyMemberDto,
  AssignFamilyMemberFailureDto,
  AssignFamilyMemberResponseDto,
  CreateFamilyDto,
  CreateFamilyResponseDto,
  GetFamilyMemberResponseDto,
  InviteFamilyDto,
  InviteFamilyFailureDto,
  InviteFamilyResponseDto,
  UpdateFamilyMemberDto,
  UpdateMyFamilyDto,
  UpdateMyFamilyResponseDto,
} from './dto';
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
import { FamilyRole } from './families.enum';

export function FamiliesUsersPostDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.Admin),
    ApiBearerAuth(),
    ApiBody({ type: AssignFamilyMemberDto }),
    ApiOperation({
      summary: 'Assign user to family',
      description: 'Assign created user to the family',
    }),
    ApiCreatedResponse({
      type: AssignFamilyMemberResponseDto,
      description: 'Assign created user to the family.',
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
      type: AssignFamilyMemberFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function FamiliesPostDec() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a family for user',
      description:
        'Create a family for user. If user signs up with social auth, this is needed. Otherwise, we create a family for him in manual sign up.',
    }),
    ApiBody({ type: CreateFamilyDto }),
    ApiCreatedResponse({
      type: CreateFamilyResponseDto,
      description: 'Returns familyId',
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

export function FamiliesUsersPutDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.Admin),
    ApiBearerAuth(),
    ApiParam({ name: 'familyId', description: 'id of family' }),
    ApiParam({ name: 'userId', description: 'id of user' }),
    ApiBody({ type: UpdateFamilyMemberDto }),
    ApiOperation({
      summary: 'Update Role',
      description: 'Change role of user assigned to family',
    }),
    ApiOkResponse({
      type: AssignFamilyMemberResponseDto,
      description:
        'User assignment to the family updated successfully. (Role changed)',
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

export function FamiliesUsersDeleteDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.Admin),
    ApiBearerAuth(),
    ApiParam({ name: 'familyId', description: 'id of family' }),
    ApiParam({ name: 'userId', description: 'id of user' }),
    ApiOperation({
      summary: 'Delete User And Family relation',
      description:
        ' Given user will not belong to the given family. Now in any action the apis will return 403.',
    }),
    ApiOkResponse({
      type: AssignFamilyMemberResponseDto,
      description: 'Deleted successfully.',
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

export function MyFamiliesGetDec() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get Family list',
      description: 'Get list of my families.',
    }),
    ApiOkResponse({
      type: [GetFamilyMemberResponseDto],
      description: 'Get list of my families.',
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

export function MyFamiliesPutDec() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: 'familyId', description: 'id of family' }),
    ApiBody({ type: UpdateMyFamilyDto }),
    ApiOperation({
      summary: 'To accept or reject family invitation',
      description: '',
    }),
    ApiOkResponse({
      type: UpdateMyFamilyResponseDto,
      description: 'Family invitation accepted/rejected.',
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

export function InviteFamilyPostDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.Admin),
    ApiBearerAuth(),
    ApiBody({ type: InviteFamilyDto }),
    ApiOperation({
      summary: 'Send Family Invitation',
      description:
        'By default isConfirm is null (pending). You can update (confirm or reject) the status in PUT: /api/v1/families/{familyId}',
    }),
    ApiCreatedResponse({
      type: InviteFamilyResponseDto,
      description: 'User invited.',
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
      type: InviteFamilyFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}
