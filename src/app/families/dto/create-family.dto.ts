import { IsNotEmpty } from 'class-validator';

export class CreateFamilyDto {
  /**
   * User's family name.
   * @example 'my family'
   */
  @IsNotEmpty()
  familyName: string;
}

export class CreateFamilyResponseDto {
  familyId: number;
}
