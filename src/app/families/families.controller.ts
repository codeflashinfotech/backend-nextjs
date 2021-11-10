import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';
import {
  AssignFamilyMemberDto,
  AssignFamilyMemberResponseDto,
  CreateFamilyDto,
  CreateFamilyResponseDto,
  InviteFamilyDto,
  InviteFamilyResponseDto,
  UpdateMyFamilyDto,
  UpdateMyFamilyResponseDto,
} from './dto';
import { DeleteFamilyMemberResponseDto } from './dto/delete-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';
import { FamiliesUsersService } from './families-users.service';
import {
  FamiliesPostDec,
  FamiliesUsersDeleteDec,
  FamiliesUsersPostDec,
  FamiliesUsersPutDec,
  InviteFamilyPostDec,
  MyFamiliesGetDec,
  MyFamiliesPutDec,
} from './families.decorator';
import {
  AssignFamilyMemberSuccessEnum,
  DeleteFamilyMemberSuccessEnum,
  InviteFamilySuccessEnum,
  UpdateMyFamilyMemberSuccessEnum,
} from './families.enum';
import { FamiliesService } from './families.service';

@ApiTags('families')
@Controller('v1/families')
export class FamiliesController {
  constructor(
    private familiesService: FamiliesService,
    private familiesUsersService: FamiliesUsersService,
    @Inject(REQUEST) private req,
  ) {}

  @Post()
  @FamiliesPostDec()
  async createFamily(
    @Body() createFamilyDto: CreateFamilyDto,
  ): Promise<CreateFamilyResponseDto> {
    const family = await this.familiesService.create(createFamilyDto);
    await this.familiesUsersService.create({
      family: family.identifiers[0],
      user: this.req.user,
    });
    return {
      familyId: family.identifiers[0].id,
    };
  }

  @Post('user')
  @FamiliesUsersPostDec()
  async assignFamilyMember(
    @Body() assignFamilyMemberDto: AssignFamilyMemberDto,
  ): Promise<AssignFamilyMemberResponseDto> {
    await this.familiesUsersService.create({
      ...assignFamilyMemberDto,
      isCreator: false,
    });
    return {
      message: AssignFamilyMemberSuccessEnum.Message,
    };
  }

  @Put(':familyId/user/:userId')
  @FamiliesUsersPutDec()
  async updateFamilyMember(
    @Param() param,
    @Body() updateFamilyMemberDto: UpdateFamilyMemberDto,
  ): Promise<AssignFamilyMemberResponseDto> {
    await this.familiesUsersService.updateOne(
      {
        family: { id: param.familyId },
        user: { id: param.userId },
      },
      updateFamilyMemberDto,
    );
    return {
      message: AssignFamilyMemberSuccessEnum.Message,
    };
  }

  @Delete(':familyId/user/:userId')
  @FamiliesUsersDeleteDec()
  async deleteFamilyMember(
    @Param() param,
  ): Promise<DeleteFamilyMemberResponseDto> {
    await this.familiesUsersService.delete({
      family: { id: param.familyId },
      user: { id: param.userId },
    });
    return {
      message: DeleteFamilyMemberSuccessEnum.Message,
    };
  }

  @Get('')
  @MyFamiliesGetDec()
  async getMyFamilies() {
    return await this.familiesUsersService.find(this.req.user.id);
  }

  @Put(':familyId')
  @MyFamiliesPutDec()
  async updateMyFamily(
    @Param() param,
    @Body() body: UpdateMyFamilyDto,
  ): Promise<UpdateMyFamilyResponseDto> {
    await this.familiesUsersService.updateOne(
      {
        family: { id: param.familyId },
        user: { id: this.req.user.id },
      },
      { isConfirmed: body.isConfirmed },
    );
    return {
      message: UpdateMyFamilyMemberSuccessEnum.Message,
    };
  }

  @Post('invitation')
  @InviteFamilyPostDec()
  async inviteFamily(
    @Body() inviteFamilyDto: InviteFamilyDto,
  ): Promise<InviteFamilyResponseDto> {
    await this.familiesUsersService.invite(inviteFamilyDto);
    return {
      message: InviteFamilySuccessEnum.Message,
    };
  }
}
