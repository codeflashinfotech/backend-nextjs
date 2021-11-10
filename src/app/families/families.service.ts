import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { CreateFamilyDto } from './dto';
import { Family } from './entities/family.entity';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private familiesRepository: Repository<Family>,
  ) {}

  async create(createFamilyDto: CreateFamilyDto): Promise<InsertResult> {
    return this.familiesRepository.insert(createFamilyDto);
  }
}
