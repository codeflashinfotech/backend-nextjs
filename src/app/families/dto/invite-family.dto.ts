import { PickType } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseUserDto } from '../../users/dto/base-user.dto';
import { IdDto } from 'src/shared/dto';
import {
  InviteFamilyErrorEnum,
  InviteFamilyErrorMsgEnum,
  InviteFamilySuccessEnum,
} from '../families.enum';

export class InviteFamilyDto extends PickType(BaseUserDto, ['email'] as const) {
  /**
   * User's one of the family ids (should be admin).
   */
  @ValidateNested()
  @Type(() => IdDto)
  family: IdDto;
}

export class InviteFamilyResponseDto {
  message: InviteFamilySuccessEnum;
}

export class InviteFamilyFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: InviteFamilyErrorEnum;

  /**
   * Description for error code.
   */
  message: InviteFamilyErrorMsgEnum;
}
