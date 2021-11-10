import {
  ResetProductInitialWeightErrorMsgEnum,
  ResetProductInitialWeightErrorStatusEnum,
  ResetProductInitialWeightSuccessEnum,
} from '../products.enum';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IdDto } from '../../../shared/dto';

export class ResetProductInitialWeightBodyDto {
  /**
   * User's one of the family ids (should be admin).
   */
  @ValidateNested()
  @Type(() => IdDto)
  family: IdDto;
}

export class ResetProductInitialWeightParamDto {
  /**
   * On sensor product id
   *  */
  @IsNotEmpty()
  productId: number;
}

export class ResetProductInitialWeightFailureDto {
  /**
   * A short code for the error that happened.
   */
  errorCode: ResetProductInitialWeightErrorStatusEnum;

  /**
   * Description for error code.
   */
  message: ResetProductInitialWeightErrorMsgEnum;
}

export class ResetProductInitialWeightResponseDto {
  message: ResetProductInitialWeightSuccessEnum;
}
