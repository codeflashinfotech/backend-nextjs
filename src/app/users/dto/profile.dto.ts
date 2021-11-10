import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseUserDto } from './base-user.dto';
import { DateDto } from 'src/shared/dto/date.dto';
import {
  ProfileAvatarDeleteSuccessEnum,
  ProfileAvatarPutErrorEnum,
  ProfileAvatarPutErrorMsgEnum,
  ProfileAvatarPutSuccessEnum,
  ProfilePutSuccessEnum,
} from '../users.enum';
import { IdDto } from 'src/shared/dto';

export class ProfileGetResponseDto extends IntersectionType(
  OmitType(BaseUserDto, ['password'] as const),
  IntersectionType(DateDto, IdDto),
) {
  @IsOptional()
  emailActive: boolean;
}

export class ProfilePutDto extends OmitType(BaseUserDto, [
  'email',
  'avatar',
] as const) {}

export class ProfilePutResponseDto {
  message: ProfilePutSuccessEnum;
}
export class ProfileAvatarDeleteResponseDto {
  message: ProfileAvatarDeleteSuccessEnum;
}
export class ProfileAvatarPutDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
export class ProfileAvatarPutResponseDto {
  message: ProfileAvatarPutSuccessEnum;
}
export class ProfileAvatarPutFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: ProfileAvatarPutErrorEnum;

  /**
   * Description for error code.
   */
  message: ProfileAvatarPutErrorMsgEnum;
}
export class ProfileAvatarPutTooLargeDto {
  /**
   * A short code for the error that happended.
   * @example 413
   */
  statusCode: number;

  /**
   * A short code for the error that happended.
   * @example "Payload Too Large"
   */
  error: string;

  /**
   * Description for error code.
   * @example "File too large"
   */
  message: string;
}
