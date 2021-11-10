import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IdDto } from '../../../shared/dto';
import {
  SetReplacementFlagErrorMsgEnum,
  SetReplacementFlagErrorStatusEnum,
  SetReplacementFlagSuccessEnum,
  UnSetReplacementFlagErrorMsgEnum,
  UnSetReplacementFlagErrorStatusEnum,
  UnSetReplacementFlagSuccessEnum,
  UpdateCustomProductErrorMsgEnum,
  UpdateCustomProductErrorStatusEnum,
} from '../products.enum';

export class SetReplacementFlagBodyDto {
  /**
   * User's one of the family ids (should be admin).
   */
  @ValidateNested()
  @Type(() => IdDto)
  family: IdDto;
}

export class SetReplacementFlagParamDto {
  /**
   * On sensor product id
   *  */
  @IsNotEmpty()
  productId: number;
}

export class SetReplacementFlagResponseDto {
  message: SetReplacementFlagSuccessEnum;
}

export class SetReplaceableFlagFailureDto {
  /**
   * A short code for the error that happened.
   */
  errorCode: SetReplacementFlagErrorStatusEnum;

  /**
   * Description for error code.
   */
  message: SetReplacementFlagErrorMsgEnum;
}

export class UnSetReplacementFlagResponseDto {
  message: UnSetReplacementFlagSuccessEnum;
}

export class UnSetReplaceableFlagFailureDto {
  /**
   * A short code for the error that happened.
   */
  errorCode: UnSetReplacementFlagErrorStatusEnum;

  /**
   * Description for error code.
   */
  message: UnSetReplacementFlagErrorMsgEnum;
}
