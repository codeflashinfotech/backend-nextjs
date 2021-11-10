import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  AssignFamilyMemberErrorEnum,
  AssignFamilyMemberErrorMsgEnum,
  AssignFamilyMemberSuccessEnum,
  FamilyRole,
} from '../families.enum';
import { IdDto } from 'src/shared/dto';

export class AssignFamilyMemberDto {
  /**
   * Member's role
   */
  @IsEnum(FamilyRole)
  @IsNotEmpty()
  role: FamilyRole;

  /**
   * User's one of the family ids (should be admin).
   */
  @ValidateNested()
  @Type(() => IdDto)
  family: IdDto;

  /**
   * User's created member's id
   */
  @ValidateNested()
  @Type(() => IdDto)
  user: IdDto;
}
export class AssignFamilyMemberResponseDto {
  message: AssignFamilyMemberSuccessEnum;
}
export class AssignFamilyMemberFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: AssignFamilyMemberErrorEnum;

  /**
   * Description for error code.
   */
  message: AssignFamilyMemberErrorMsgEnum;
}
