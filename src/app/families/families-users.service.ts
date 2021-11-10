import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { FamilyUser } from './entities/family-user.entity';
import { InviteFamilyDto } from './dto';
import { MailProviderService } from 'src/providers/mail/mail.service';
import { UsersService } from '../users/users.service';
import {
  AssignFamilyMemberErrorEnum,
  AssignFamilyMemberErrorMsgEnum,
  FamilyRole,
  InviteFamilyErrorEnum,
  InviteFamilyErrorMsgEnum,
} from './families.enum';

@Injectable()
export class FamiliesUsersService {
  constructor(
    @InjectRepository(FamilyUser)
    private familiesUsersRepository: Repository<FamilyUser>,
    private usersService: UsersService,
    private mailProviderService: MailProviderService,
  ) {}

  async create(data): Promise<InsertResult> {
    try {
      return await this.familiesUsersRepository.insert(data);
    } catch (e) {
      throw new UnprocessableEntityException({
        errorCode: AssignFamilyMemberErrorEnum.AssignmentDuplicate,
        message: AssignFamilyMemberErrorMsgEnum.AssignmentDuplicate,
      });
    }
  }

  async findOne(data): Promise<FamilyUser> {
    return await this.familiesUsersRepository.findOne(data);
  }

  async updateOne(condition, data): Promise<void> {
    await this.familiesUsersRepository.update(condition, data);
  }

  async delete(condition): Promise<void> {
    await this.familiesUsersRepository.delete(condition);
  }

  async find(userId): Promise<FamilyUser[]> {
    return await this.familiesUsersRepository.find({
      relations: ['family'],
      where: {
        user: { id: userId },
      },
    });
  }
  async findFamilyMember(familyId): Promise<FamilyUser[]> {
    return await this.familiesUsersRepository.find({
      relations: ['user'],
      where: {
        family: { id: familyId },
      },
    });
  }

  async invite(inviteFamilyDto: InviteFamilyDto): Promise<void> {
    const user = await this.usersService.findOne({
      email: inviteFamilyDto.email,
      emailActive: true,
    });
    if (!user) {
      throw new UnprocessableEntityException({
        errorCode: InviteFamilyErrorEnum.UserNotExist,
        message: InviteFamilyErrorMsgEnum.UserNotExist,
      });
    }
    try {
      await this.create({
        user: { id: user.id },
        family: { id: inviteFamilyDto.family.id },
        isCreator: false,
        isConfirmed: null,
        role: FamilyRole.User,
      });
    } catch (e) {
      throw new UnprocessableEntityException({
        errorCode: InviteFamilyErrorEnum.AlreadyInvited,
        message: InviteFamilyErrorMsgEnum.AlreadyInvited,
      });
    }
    await this.mailProviderService.sendEmail(
      inviteFamilyDto.email,
      'PantryOn Family Invitation',
      `
        <div>Hi ${user.fullName}.</div>
        <div>You have been invited to a family. Please log in to PantryOn app in order to accept.</div>
      `,
    );
  }
}
