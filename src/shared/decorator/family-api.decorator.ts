import { SetMetadata } from '@nestjs/common';
import { FamilyRole } from 'src/app/families/families.enum';

export const ROLES_KEY = 'FamilyRoles';
export const FamilyRoles = (...roles: FamilyRole[]) =>
  SetMetadata(ROLES_KEY, roles);
