import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { FamiliesService } from '../families/families.service';
import { FamiliesUsersService } from '../families/families-users.service';
import { MailProviderService } from 'src/providers/mail/mail.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  ForgetpassConfirmDto,
  ForgetpassConfirmResponseDto,
  ForgetpassDto,
  ForgetpassResponseDto,
  LoginResponseDto,
  SignupConfirmDto,
  SignupConfirmResponseDto,
  SignupDto,
  SignupResponseDto,
} from './dto';
import {
  ForgetpassConfirmErrorEnum,
  ForgetpassConfirmErrorMsgEnum,
  ForgetPassConfirmSuccessEnum,
  ForgetPassErrorEnum,
  ForgetPassErrorMsgEnum,
  ForgetPassSuccessEnum,
  LoginErrorEnum,
  LoginErrorMsgEnum,
  OAuthErrorEnum,
  OAuthErrorMsgEnum,
  SignupConfirmErrorEnum,
  SignupConfirmErrorMsgEnum,
  SignupErrorEnum,
  SignupErrorMsgEnum,
  SignupSuccessEnum,
  SocialOAuthProvidersEnum,
} from './auth.enum';

import { SocialAuthProviderService } from 'src/providers/social-auth/social-auth.service';
import {
  IOAuth,
  IUserInfo,
} from 'src/providers/social-auth/social-auth.interface';
import { AppConfigService } from 'src/config/app/config.service';

@Injectable()
export class AuthService {
  mode = this.appConfigService.MODE;

  constructor(
    private usersService: UsersService,
    private familiesService: FamiliesService,
    private familiesUsersService: FamiliesUsersService,
    private jwtService: JwtService,
    private mailProviderService: MailProviderService,
    private appConfigService: AppConfigService,
    private socialAuthProviderService: SocialAuthProviderService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({
      email,
      emailActive: true,
    });
    try {
      return user && (await user.comparePassword(password)) ? user : null;
    } catch {
      throw new UnprocessableEntityException({
        errorCode: LoginErrorEnum.PasswordNotset,
        message: LoginErrorMsgEnum.PasswordNotset,
      });
    }
  }

  login(user: User): LoginResponseDto {
    return this.createToken(user);
  }

  async signup(userDto: SignupDto): Promise<SignupResponseDto> {
    const { email } = userDto;
    const user = await this.usersService.findOne({ email: email });
    return this.completeSignup(user, userDto);
  }

  async signupConfirm(
    userDto: SignupConfirmDto,
  ): Promise<SignupConfirmResponseDto> {
    const { email } = userDto;
    const user = await this.usersService.findOne({ email: email });
    return this.completeSignupConfirm(user, userDto);
  }

  async forgetPass(userDto: ForgetpassDto): Promise<ForgetpassResponseDto> {
    const { email } = userDto;
    const user = await this.usersService.findOne({ email: email });
    return this.completeForgetPass(user, userDto);
  }

  async forgetPassConfirm(
    userDto: ForgetpassConfirmDto,
  ): Promise<ForgetpassConfirmResponseDto> {
    const { email } = userDto;
    const user = await this.usersService.findOne({ email: email });
    return this.completeForgetPassConfirm(user, userDto);
  }

  async socialAuth(
    providerName: string,
    authDto: IOAuth,
  ): Promise<LoginResponseDto> {
    try {
      const userInfo = await this.socialAuthProviderService.auth(
        SocialOAuthProvidersEnum[providerName.toUpperCase()],
        authDto,
      );
      return this.completeOAuth(userInfo);
    } catch (error) {
      throw new UnprocessableEntityException({
        errorCode: OAuthErrorEnum.InvalidToken,
        message: OAuthErrorMsgEnum.InvalidToken,
      });
    }
  }

  private createToken(user: User): LoginResponseDto {
    const payload = { id: user.id, email: user.email, fullName: user.fullName };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async completeSignup(
    user: User,
    userDto: SignupDto,
  ): Promise<SignupResponseDto> {
    this.checkVerifiedUser(
      user,
      SignupErrorEnum.DuplicateEmail,
      SignupErrorMsgEnum.DuplicateEmail,
    );
    const userDtoObj: any = userDto;
    userDtoObj.emailCode = Math.floor(1000 + Math.random() * 9000);
    !user
      ? await this.usersService.createOne(userDtoObj)
      : await this.usersService.updateOne(user.id, userDtoObj);

    await this.mailProviderService.sendEmail(
      userDtoObj.email,
      'PantryOn Confirmation Code',
      `
        <div>Welcome to PantryOn.</div>
        <div>Your confirmation code is <b>${userDtoObj.emailCode}</b></div>
      `,
    );
    return {
      message: SignupSuccessEnum.Message,
    };
  }

  private async completeOAuth(userDto: IUserInfo): Promise<LoginResponseDto> {
    let user = await this.usersService.findOne({ email: userDto.email });
    !user
      ? await this.usersService.createOne(userDto)
      : await this.usersService.updateOne(user.id, { emailActive: true });

    user = !user
      ? await this.usersService.findOne({ email: userDto.email })
      : user;
    return this.createToken(user);
  }

  private async completeSignupConfirm(
    user: User,
    userDto: SignupConfirmDto,
  ): Promise<SignupConfirmResponseDto> {
    this.checkVerifiedUser(
      user,
      SignupConfirmErrorEnum.AlreadyConfirmed,
      SignupConfirmErrorMsgEnum.AlreadyConfirmed,
    );
    if (user.emailCode != userDto.emailCode && this.mode == 'PROD') {
      throw new UnprocessableEntityException({
        errorCode: SignupConfirmErrorEnum.CodeNotValid,
        message: SignupConfirmErrorMsgEnum.CodeNotValid,
      });
    }
    const userDtoObj: any = userDto;
    userDtoObj.emailActive = true;
    await this.usersService.updateOne(user.id, userDtoObj);

    // Add to families and families_users (Many to Many)
    const family = await this.familiesService.create({
      familyName: userDto.familyName,
    });
    await this.familiesUsersService.create({
      family: family.identifiers[0],
      user: { id: user.id },
    });

    return this.createToken(user);
  }

  private async completeForgetPass(
    user: User,
    userDto: ForgetpassDto,
  ): Promise<ForgetpassResponseDto> {
    if (!user || (user && !user.emailActive)) {
      throw new UnprocessableEntityException({
        errorCode: ForgetPassErrorEnum.EmailNotFound,
        message: ForgetPassErrorMsgEnum.EmailNotFound,
      });
    }
    const forgetPassCode = Math.floor(1000 + Math.random() * 9000);
    await this.usersService.updateOne(user.id, { forgetPassCode });
    await this.mailProviderService.sendEmail(
      userDto.email,
      'PantryOn Confirmation Code',
      `
        <div>Welcome to PantryOn.</div>
        <div>Your confirmation code is <b>${forgetPassCode}</b></div>
      `,
    );
    return {
      message: ForgetPassSuccessEnum.Message,
    };
  }

  private async completeForgetPassConfirm(
    user: User,
    userDto: ForgetpassConfirmDto,
  ): Promise<ForgetpassConfirmResponseDto> {
    if (user.forgetPassCode != userDto.forgetPassCode && this.mode == 'PROD') {
      throw new UnprocessableEntityException({
        errorCode: ForgetpassConfirmErrorEnum.CodeNotValid,
        message: ForgetpassConfirmErrorMsgEnum.CodeNotValid,
      });
    }
    await this.usersService.updateOne(user.id, userDto);
    return {
      message: ForgetPassConfirmSuccessEnum.Message,
    };
  }

  private checkVerifiedUser(user, errorCode, message): void {
    if (user && user.emailActive) {
      throw new UnprocessableEntityException({
        errorCode: errorCode,
        message: message,
      });
    }
  }
}
