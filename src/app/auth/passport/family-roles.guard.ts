import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/shared/decorator/family-api.decorator';
import { FamiliesUsersService } from '../../families/families-users.service';
import { FamilyRole } from '../../families/families.enum';
import { FindConditions } from 'typeorm';
import { FamilyUser } from '../../families/entities/family-user.entity';

@Injectable()
export class FamilyRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private familiesUsersService: FamiliesUsersService,
  ) {}

  /**
   * To check if the current user is a member (or admin) of the family sent in the body or param
   * If data is in body, family id should be like this: family: {id: 5}
   * If data is in param, it should be familyId
   * The role is determined in each request's decorators
   * @example @FamilyRoles(FamilyRole.Admin) means the api will response 403 if user is not admin in the family
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<FamilyRole>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const familyId = this.getFamilyId(context);

    const options: FindConditions<FamilyUser> = {
      family: { id: familyId },
      user: { id: user.id },
      isConfirmed: true,
    };
    if (requiredRoles[0] == FamilyRole.Admin) {
      options.role = FamilyRole.Admin;
    }
    const family = await this.familiesUsersService.findOne(options);
    return family ? true : false;
  }

  getFamilyId(context) {
    const body = context.switchToHttp().getRequest().body;
    const params = context.switchToHttp().getRequest().params;
    const query = context.switchToHttp().getRequest().query;
    let familyId;

    if (body?.family?.id) familyId = body?.family?.id;
    else if (query?.familyId) familyId = query?.familyId;
    else if (params?.familyId) familyId = params?.familyId;

    return familyId;
  }
}
