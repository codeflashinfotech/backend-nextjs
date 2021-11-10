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
  ApiParam,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FamilyRoles } from 'src/shared/decorator/family-api.decorator';
import { BadRequestDto, ForbiddenDto, UnauthorizedDto } from 'src/shared/dto';
import { FamilyRole } from '../families/families.enum';
import {
  CreateFavoriteProductResponseDto,
  CreateNewProductBodyDto,
  CreateNewProductFailureDto,
  CreateNewProductResponseDto,
  DeleteFavoriteProductFailureDto,
  DeleteProductResponseDto,
  GetSensorsProductsResponseDto,
  ResetProductInitialWeightFailureDto,
  ResetProductInitialWeightResponseDto,
  SearchVendorFailureDto,
  UpdateCustomProductFailureDto,
  UpdateCustomProductResponseDto,
  UpdateProductBodyDTO,
  UpdateProductFailureDto,
  UpdateProductResponseDto,
  SetReplaceableFlagFailureDto,
  SetReplacementFlagResponseDto,
  UnSetReplaceableFlagFailureDto,
  UnSetReplacementFlagResponseDto,
  GetSensorProductStatusResponseDto,
  AddVendorsToCartFailureDto,
  AuthorizeWithCodeResponseDto,
} from './dto';
import {
  VendorsProviderNamesEnum,
  CreateFavoriteProductEnum,
} from './products.enum';
import { GetCustomListResponseDto } from './dto/get-custom-list.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSize } from '../../shared/module/upload/upload.enum';
import { imageFileFilter } from '../../shared/utils/upload-util';

export function SensorProductsGetDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get list of sensors products',
      description: 'This API returns a list of sensor products',
    }),
    ApiOkResponse({
      type: GetSensorsProductsResponseDto,
      description: 'Get list of products of sensors',
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

export function CreateCustomProductDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    UseInterceptors(
      FileInterceptor('file', {
        limits: { fileSize: FileSize.OneMB },
        fileFilter: imageFileFilter,
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: CreateNewProductBodyDto }),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create new Custom Product',
      description:
        'create custom product,it used before in search page custom tab.',
    }),
    ApiCreatedResponse({
      type: CreateNewProductResponseDto,
      description: 'success message for creating new product',
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
    ApiUnprocessableEntityResponse({
      type: CreateNewProductFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function UpdateProductDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    UseInterceptors(
      FileInterceptor('file', {
        limits: { fileSize: FileSize.OneMB },
        fileFilter: imageFileFilter,
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: UpdateProductBodyDTO }),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update a Product',
      description:
        "Use this API for both update shopping list and sensor product. for separation use query param (isShoppingListItem) if api called from shopping list it should be true else it should be false. and in sensor product for updating consumption send  'consumption' and 'Weight' property in body. when isShoppingListItem is true,Body property`s isReset and isOldProduct are useless",
    }),
    ApiOkResponse({
      type: UpdateProductResponseDto,
      description: 'success message for update product',
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
    ApiUnprocessableEntityResponse({
      type: UpdateProductFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function resetProductInitialWeightDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'make product 100 percent',
      description:
        'update product initialWeight with weight to make product 100 percent',
    }),
    ApiOkResponse({
      type: ResetProductInitialWeightResponseDto,
      description: 'success message for make product 100 percent',
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
    ApiUnprocessableEntityResponse({
      type: ResetProductInitialWeightFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function RunningLowProductsGetDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get list of running low products. (What I need)',
      description: '',
    }),
    ApiOkResponse({
      type: GetSensorsProductsResponseDto,
      description: 'Get list of running low products. (What I need)',
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

export function DeleteProductDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a Product',
      description: 'remove product from shopping list',
    }),
    ApiOkResponse({
      type: DeleteProductResponseDto,
      description: 'success message for Deleting product',
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

export function GetCustomProductLisDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get list of custom products',
      description:
        'This API returns a list of custom  products ,it used before in search page custom tab.',
    }),
    ApiOkResponse({
      type: GetCustomListResponseDto,
      description: 'Get list of products',
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

export function FavoriteCreateDec() {
  return applyDecorators(
    ApiBearerAuth(),
    FamilyRoles(FamilyRole.User),
    ApiOperation({
      summary: 'Add product to favorite',
      description:
        'Pass product info from running low (or other parts) to this api in order to add to the favorites.',
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
      type: CreateFavoriteProductResponseDto,
      description: CreateFavoriteProductEnum.Message,
    }),
  );
}

export function FavoriteGetDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'List of favorite products',
      description:
        'Get list of favorite products of given family. User should have "User" Role in given family.',
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
      description: 'Bad request. Body or Query properties are invalid.',
    }),
  );
}

export function FavoriteDeleteDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a product from favorite list.',
      description:
        'Delete a product from favorite list with given family id. User should have "User" Role in given family.',
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
      description: 'Bad request. Body or Query properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: DeleteFavoriteProductFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function SearchVendorsDec() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Search products with given term',
      description:
        'Search a product from APIs like Kroger, Nutrix and etc with given term.',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body or Query properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: SearchVendorFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function CheckConnectionDec() {
  return applyDecorators(
    ApiBearerAuth(),
    FamilyRoles(FamilyRole.User),
    ApiParam({
      name: 'vendorProvider',
      description: 'name of vendor provider',
      enum: VendorsProviderNamesEnum,
    }),
    ApiOperation({
      summary: 'Check connection for given provider and familyId',
      description:
        'This API check connection to cart of given vendor provider and familyId',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body or Query properties are invalid.',
    }),
  );
}

export function AddVendorsToCartDec() {
  return applyDecorators(
    ApiBearerAuth(),
    FamilyRoles(FamilyRole.Admin),
    ApiParam({
      name: 'vendorProvider',
      description: 'name of vendor provider',
      enum: VendorsProviderNamesEnum,
    }),
    ApiOperation({
      summary: 'Add to cart vendor',
      description: 'Add vendor to customers cart',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body or Query properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: AddVendorsToCartFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function AuthorizeWithCodeDec() {
  return applyDecorators(
    ApiBearerAuth(),
    FamilyRoles(FamilyRole.Admin),
    ApiParam({
      name: 'vendorProvider',
      description: 'name of vendor provider',
      enum: VendorsProviderNamesEnum,
    }),
    ApiOperation({
      summary: 'Authorize client with given code',
      description: 'Save token for user',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),

    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body or Query properties are invalid.',
    }),
  );
}

export function UpdateCustomProductDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    UseInterceptors(
      FileInterceptor('file', {
        limits: { fileSize: FileSize.OneMB },
        fileFilter: imageFileFilter,
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'update custom product',
      description: 'update custom product',
    }),
    ApiOkResponse({
      type: UpdateCustomProductResponseDto,
      description: 'successful message for update custom product.',
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
      description: 'Bad request. Body or Query properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: UpdateCustomProductFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function SetReplacementFlagDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'set product replaceable',
      description:
        'set isReset and isOldProduct flags to make product replaceable (isReset=true,isOldProduct=false)',
    }),
    ApiOkResponse({
      type: SetReplacementFlagResponseDto,
      description: 'successful message for make product replaceable.',
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
      description: 'Bad request. Body or Query properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: SetReplaceableFlagFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function UnSetReplacementFlagDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'unset product replaceable',
      description:
        'unset flags to make product Irreplaceable (isReset=false,isOldProduct=true)',
    }),
    ApiOkResponse({
      type: UnSetReplacementFlagResponseDto,
      description: 'successful message for make product replaceable.',
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
      description: 'Bad request. Body or Query properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: UnSetReplaceableFlagFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function GetSensorProductStatusDec() {
  return applyDecorators(
    FamilyRoles(FamilyRole.User),
    ApiBearerAuth(),
    ApiOperation({
      summary: ' get sensor product status',
      description: 'used for get product srtatus in core flow',
    }),
    ApiOkResponse({
      type: GetSensorProductStatusResponseDto,
      description: 'product status object',
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
      description: 'Bad request. Body or Query properties are invalid.',
    }),
  );
}
