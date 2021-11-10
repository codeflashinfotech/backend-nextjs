import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FavoriteFoods } from '../entities/favorite.foods.entity';

export class GetFavoriteProductDto {
  /**
   * Id of family (Required Role: User)
   */
  @IsNotEmpty()
  familyId: number;
}

export class GetFavoriteProductResponseDto extends OmitType(FavoriteFoods, [
  'user',
  'family',
]) {}
