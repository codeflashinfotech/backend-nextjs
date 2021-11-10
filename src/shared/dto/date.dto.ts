import { IsOptional } from 'class-validator';

export class DateDto {
  @IsOptional()
  createdAt?: string;

  @IsOptional()
  updatedAt?: string;

  @IsOptional()
  deletedAt?: string;
}
