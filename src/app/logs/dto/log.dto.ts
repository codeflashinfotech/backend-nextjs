import { LogSuccessEnum } from '../logs.enum';
import { IsInt, IsNotEmpty } from 'class-validator';

export class LogDto {
  @IsNotEmpty()
  @IsInt()
  type: number;

  @IsNotEmpty()
  logData: string;

  @IsNotEmpty()
  deviceOs: string;

  @IsNotEmpty()
  extraData: string;

  @IsNotEmpty()
  sessionId: string;
}

export class LogResponseDto {
  message: LogSuccessEnum;
}
