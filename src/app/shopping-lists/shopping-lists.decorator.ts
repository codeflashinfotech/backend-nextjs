import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FamilyRoles } from 'src/shared/decorator/family-api.decorator';
import { BadRequestDto, ForbiddenDto, UnauthorizedDto } from 'src/shared/dto';
import { FamilyRole } from '../families/families.enum';
import {
  AddProductToShoppingBodyDTO,
  AddProductToShoppingResponseDto,
  CreateShoppingListDtoResponse,
  DeleteShoppingListResponseDto,
  GetShoppingListResponseDTO,
  UpdateShoppingListFailureDto,
  UpdateShoppingListResponseDto,
  UpdateWeightIndexResponseDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSize } from '../../shared/module/upload/upload.enum';
import { imageFileFilter } from '../../shared/utils/upload-util';

export function ShoppingListGETDec() {
  return applyDecorators(
    ApiBearerAuth(),
    FamilyRoles(FamilyRole.User),
    ApiOperation({
      summary: 'Get all shopping lists',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Query param properties are invalid.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiOkResponse({
      type: [GetShoppingListResponseDTO],
      description: 'Get all Shopping list with giving Family Id ',
    }),
  );
}

export function ShoppingListUpdateDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update a shopping lists',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. request param or body properties are invalid.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiOkResponse({
      type: UpdateShoppingListResponseDto,
      description: 'Update the shopping list name',
    }),
    ApiUnprocessableEntityResponse({
      type: UpdateShoppingListFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function ShoppingListDeleteDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a shopping lists',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. request param or body properties are invalid.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiOkResponse({
      type: DeleteShoppingListResponseDto,
      description: 'Delete the shopping list name',
    }),
  );
}

export function ShoppingListCreateDec() {
  return applyDecorators(
    ApiBearerAuth(),
    FamilyRoles(FamilyRole.User),
    ApiOperation({
      summary: 'Create new shopping list',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body properties are invalid.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiForbiddenResponse({
      type: ForbiddenDto,
      description: 'Forbidden.',
    }),
    ApiCreatedResponse({
      type: CreateShoppingListDtoResponse,
      description: 'create new Shopping list with giving Family Id ',
    }),
  );
}

export function AddProductToShoppingListPostDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    UseInterceptors(
      FileInterceptor('file', {
        limits: { fileSize: FileSize.OneMB },
        fileFilter: imageFileFilter,
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: AddProductToShoppingBodyDTO }),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Add a product to shopping list',
      description: 'This api add a product with its id to shopping list',
    }),
    ApiCreatedResponse({
      type: AddProductToShoppingResponseDto,
      description: 'success message for add product to shopping list',
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

export function UpdateWeightIndexDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update shopping List Weight index',
      description: '',
    }),
    ApiOkResponse({
      type: UpdateWeightIndexResponseDto,
      description: 'success message for update shopping list weight index',
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
