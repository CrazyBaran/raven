import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity';

@Injectable()
export class OpportunityService {
  public constructor(
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
  ) {}

  public async findAll(): Promise<Opportunity[]> {
    return this.opportunityRepository.find();
  }

  public async findOne(id: string): Promise<Opportunity> {
    return this.opportunityRepository.findOne({
      where: { id },
    });
  }

  public async create(opportunity: Opportunity): Promise<Opportunity> {
    return this.opportunityRepository.save(opportunity);
  }

  public async update(id: string, opportunity: Opportunity): Promise<void> {
    await this.opportunityRepository.update(id, opportunity);
  }

  public async remove(id: string): Promise<void> {
    await this.opportunityRepository.delete(id);
  }
}
