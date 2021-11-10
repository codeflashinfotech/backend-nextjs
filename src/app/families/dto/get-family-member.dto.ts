import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FamilyUser } from 'src/app/families/entities/family-user.entity';
import { GetFamilyDto } from '.';

export class GetFamilyMemberResponseDto extends OmitType(FamilyUser, [
  'family',
  'user',
] as const) {
  /**
   * Family's object
   */
  @Type(() => GetFamilyDto)
  family: GetFamilyDto;
}
