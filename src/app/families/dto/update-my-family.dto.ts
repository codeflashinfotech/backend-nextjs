import { IsNotEmpty } from 'class-validator';
import { UpdateMyFamilyMemberSuccessEnum } from '../families.enum';

export class UpdateMyFamilyDto {
  /**
   * Whether user accept or reject
   * @example true
   */
  @IsNotEmpty()
  isConfirmed: boolean;
}

export class UpdateMyFamilyResponseDto {
  message: UpdateMyFamilyMemberSuccessEnum;
}
