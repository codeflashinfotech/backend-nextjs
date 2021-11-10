import { OmitType } from '@nestjs/swagger';
import { CustomFoods } from '../entities/custom-foods.entity';

export class GetCustomListResponseDto extends OmitType(CustomFoods, [
  'family',
  'user',
]) {}
