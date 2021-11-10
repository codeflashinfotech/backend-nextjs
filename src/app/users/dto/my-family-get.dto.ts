import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FamilyUser } from 'src/app/families/entities/family-user.entity';
import { ProfileGetResponseDto } from './profile.dto';

export class MyFamilyGetResponseDto extends OmitType(FamilyUser, [
  'family',
  'user',
]) {
  /**
   * User's object
   */
  @Type(() => ProfileGetResponseDto)
  user: ProfileGetResponseDto;
}
