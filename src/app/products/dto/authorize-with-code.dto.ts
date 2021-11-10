import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { KrogerAuthorizeMsgEnum } from 'src/providers/vendors/kroger/kroger.enum';
import { IdDto } from 'src/shared/dto';

export class AuthorizeWithCodeDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  redirect_uri: string;

  /**
   * User's one of the family ids (should be user).
   */
  @ValidateNested()
  @Type(() => IdDto)
  family: IdDto;
}

export class AuthorizeWithCodeParamDto {
  @IsNotEmpty()
  @IsString()
  vendorProvider: string;
}

export class CheckConnectionParamDto {
  @IsNotEmpty()
  @IsString()
  vendorProvider: string;
  @IsNotEmpty()
  @IsString()
  familyId: string;
}

export class AuthorizeWithCodeResponseDto {
  message: KrogerAuthorizeMsgEnum;
}

export class CheckConnectionResponseDto {
  message: boolean;
}
