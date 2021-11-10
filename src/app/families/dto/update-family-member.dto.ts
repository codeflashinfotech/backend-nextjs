import { PickType } from '@nestjs/swagger';
import { AssignFamilyMemberDto } from '.';

export class UpdateFamilyMemberDto extends PickType(AssignFamilyMemberDto, [
  'role',
] as const) {}
