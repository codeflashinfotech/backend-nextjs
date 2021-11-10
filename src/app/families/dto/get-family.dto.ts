import { IntersectionType } from '@nestjs/swagger';
import { IdDto } from 'src/shared/dto';
import { DateDto } from 'src/shared/dto/date.dto';
import { BaseFamilyDto } from './base.dto';

export class GetFamilyDto extends IntersectionType(
  BaseFamilyDto,
  IntersectionType(DateDto, IdDto),
) {}
