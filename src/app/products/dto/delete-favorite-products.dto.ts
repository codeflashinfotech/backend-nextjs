import { IsNotEmpty } from 'class-validator';
import {
  DeleteFavoriteProductEnum,
  DeleteFavoriteProductErrorMsgEnum,
  DeleteFavoriteProductErrorStatusEnum,
} from '../products.enum';

export class DeleteFavoriteProductQueryDto {
  /**
   * Id of family (Required Role: User)
   * */
  @IsNotEmpty()
  familyId: number;
}

export class DeleteFavoriteProductParamDto {
  /**
   * Id of favorite
   * */
  @IsNotEmpty()
  favoriteId: number;
}

export class DeleteFavoriteProductResponseDto {
  /**
   * Success response.
   */
  message: DeleteFavoriteProductEnum;
}

export class DeleteFavoriteProductFailureDto {
  /**
   * A short code for the error that happened.
   */
  errorCode: DeleteFavoriteProductErrorStatusEnum;

  /**
   * Description for error code.
   */
  message: DeleteFavoriteProductErrorMsgEnum;
}
