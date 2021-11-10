import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';
import { FamilyUser } from '../families/entities/family-user.entity';
import { FamiliesUsersService } from '../families/families-users.service';
import {
  CreateMemberDto,
  ProfileAvatarDeleteResponseDto,
  ProfileAvatarPutResponseDto,
  ProfilePutDto,
  ProfilePutResponseDto,
} from './dto';
import {
  MyFamilyGet,
  ProfileAvatarDeleteDec,
  ProfileAvatarPutDec,
  ProfileGetDec,
  ProfilePutDec,
  UserPostDec,
} from './users.decorator';
import { User } from './users.entity';
import {
  ProfileAvatarDeleteSuccessEnum,
  ProfileAvatarPutSuccessEnum,
  ProfilePutSuccessEnum,
} from './users.enum';
import { UsersService } from './users.service';
import { FileInterface } from '../../shared/module/upload/upload.interface';

@ApiTags('users')
@Controller('v1/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private familiesUsersService: FamiliesUsersService,
    @Inject(REQUEST) private req,
  ) {}

  @Get('profile')
  @ProfileGetDec()
  async getProfileInfo(): Promise<User> {
    return await this.usersService.findOne({ id: this.req.user.id });
  }

  @Put('profile')
  @ProfilePutDec()
  async updateProfileInfo(
    @Body() body: ProfilePutDto,
  ): Promise<ProfilePutResponseDto> {
    await this.usersService.updateOne({ id: this.req.user.id }, body);
    return { message: ProfilePutSuccessEnum.Message };
  }

  @Put('profile/avatar')
  @ProfileAvatarPutDec()
  async uploadAvatar(
    @UploadedFile() file: FileInterface,
  ): Promise<ProfileAvatarPutResponseDto> {
    await this.usersService.uploadAvatar(file, this.req.user.id);
    return { message: ProfileAvatarPutSuccessEnum.Message };
  }

  @Delete('profile/avatar')
  @ProfileAvatarDeleteDec()
  async deleteAvatar(): Promise<ProfileAvatarDeleteResponseDto> {
    await this.usersService.updateOne(
      { id: this.req.user.id },
      { avatar: null },
    );
    return { message: ProfileAvatarDeleteSuccessEnum.Message };
  }

  @Post()
  @UserPostDec()
  async createUser(@Body() body: CreateMemberDto): Promise<User> {
    return await this.usersService.createMember(body);
  }

  @Get('family/:familyId')
  @MyFamilyGet()
  async getFamilyMembers(@Param() params): Promise<FamilyUser[]> {
    return await this.familiesUsersService.findFamilyMember(params.familyId);
  }
}
