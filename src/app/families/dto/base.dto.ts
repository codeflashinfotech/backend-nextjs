import { IsEnum, IsNotEmpty } from 'class-validator';
import { FamilyRole } from '../families.enum';

export class BaseFamilyDto {
  /**
   * User's family name.
   * @example 'Alexferri'
   */
  @IsNotEmpty()
  familyName: string;
}

export class BaseFamilyUserDto {
  /**
   * Member's role
   */
  @IsEnum(FamilyRole)
  @IsNotEmpty()
  role: FamilyRole;
}
