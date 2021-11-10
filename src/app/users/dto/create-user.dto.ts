import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateMemberErrorEnum, CreateMemberErrorMsgEnum } from '../users.enum';

export class CreateMemberDto extends PickType(BaseUserDto, [
  'fullName',
  'username',
  'age',
  'gender',
] as const) {
  /**
   * User's email should goes here. Email is optional here.
   * @example 'info@pantryon.com'
   */
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  fullName: string;
}

export class CreateMemberDtoFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: CreateMemberErrorEnum;

  /**
   * Description for error code.
   */
  message: CreateMemberErrorMsgEnum;
}
