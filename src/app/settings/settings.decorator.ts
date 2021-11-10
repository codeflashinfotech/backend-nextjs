import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/shared/decorator/public-api.decorator';
import { BadRequestDto, UnauthorizedDto } from '../../shared/dto';
import {
  GetImagesBaseDataResponseDto,
  GetAppVersionResponseDto,
  GetApiVersionResponseDto,
  InsertAppVersionResponseDto,
} from './dto';

export function ImageSettingGetDec() {
  return applyDecorators(
    Public(),
    ApiOperation({
      summary: 'Get Image Base Data',
      description: `In file uploads apis, backend just save the file name. You should get other part of the url by this api in order to load the file or image.<br>
        With this api you can get image base info: baseUrl and all buckets (you should choose the proper bucket based on where you are working). Then you get the file name in other apis.<br><br>
        example:<br><br>
        <code> https://{s3AvatarBucket}.{s3BaseUrl}/{fileName} => https://pantryon-user-avatar.s3.amazonaws.com/f-d917c812-9b88-4aa8-b5ab-3be601eef3db.jpeg</code><br><br><br>
        <b>Note: in some cases you will see full url. E.g. if user registers by google auth. You can recognize them with a regex pattern.</b>`,
    }),
    ApiOkResponse({
      type: GetImagesBaseDataResponseDto,
      description: 'returns images base Url and Buckets Name',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
  );
}

export function getApiVersionDec() {
  return applyDecorators(
    Public(),
    ApiOperation({
      summary: 'Get API Version',
      description:
        'With this method, Front end can figure out what the API version is and if necessary, give the user a message to update the mobile application ',
    }),
    ApiOkResponse({
      type: GetApiVersionResponseDto,
      description: 'Returns API version',
    }),
  );
}

export function getAppVersionDec() {
  return applyDecorators(
    Public(),
    ApiOperation({
      summary: 'Get App Version',
      description:
        'With this method, Front end can figure out what the last app version is and if necessary, give the user a message to update the mobile application ',
    }),
    ApiOkResponse({
      type: GetAppVersionResponseDto,
      description: 'Returns App version',
    }),
  );
}

export function insertAppVersionDec() {
  return applyDecorators(
    Public(),
    ApiOperation({
      summary: 'Insert App Version',
      description:
        'With this method, Front end can insert its last app version',
    }),
    ApiCreatedResponse({
      type: InsertAppVersionResponseDto,
      description: 'Returns Inserted App version',
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
