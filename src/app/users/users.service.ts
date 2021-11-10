import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateMemberDto } from './dto';
import { CreateMemberErrorEnum, CreateMemberErrorMsgEnum } from './users.enum';
import { MailProviderService } from 'src/providers/mail/mail.service';
import { FileInterface } from '../../shared/module/upload/upload.interface';
import { UploadService } from '../../shared/module/upload/upload.service';
import { AWSConfigService } from 'src/config/aws/config.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailProviderService: MailProviderService,
    private uploadService: UploadService,
    private awsConfigService: AWSConfigService,
  ) {}

  findOne(condition): Promise<User> {
    return this.usersRepository.findOne(condition);
  }

  async createOne(data): Promise<User[]> {
    const user = await this.usersRepository.create(data);
    return await this.usersRepository.save(user);
  }

  async updateOne(id, data): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    Object.assign(user, { ...data });
    return await this.usersRepository.save(user);
  }

  async createMember(data: CreateMemberDto): Promise<User> {
    const randomPassword = Math.random().toString(36).substring(2, 8);
    let user;
    const userData = {
      ...data,
      password: randomPassword,
      emailActive: true,
    };
    if (data.email) {
      user = await this.findOne({ email: data.email });
      if (user && user.emailActive) {
        throw new UnprocessableEntityException({
          errorCode: CreateMemberErrorEnum.DuplicateEmail,
          message: CreateMemberErrorMsgEnum.DuplicateEmail,
        });
      }
      user = !user
        ? await this.createOne(userData)
        : await this.updateOne(user.id, userData);
      await this.mailProviderService.sendEmail(
        user.email,
        'PantryOn Family Member',
        `
          <div>Welcome to PantryOn.</div>
          <div>You are added to a family on PantryOn application.</div>
          <div>Your email: ${user.email} Your temporary password: <b>${randomPassword}</b></div>
          <div>Download links: <a href="https://pantryon.com/">https://pantryon.com</a></div>
        `,
      );
    } else {
      user = await this.createOne(userData);
    }
    return user;
  }

  async uploadAvatar(file: FileInterface, userId): Promise<void> {
    const uploadResult = await this.uploadService.uploadToS3({
      Bucket: this.awsConfigService.S3_AVATAR_BUCKET,
      Body: file.buffer,
      Key: this.uploadService.uniqueFileName(file.originalname),
    });
    await this.updateOne({ id: userId }, { avatar: uploadResult.Key });
  }
}
