import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OpportunityEntity } from './entities/opportunity.entity';

@Injectable()
export class OpportunityService {
  public constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
  ) {}

  public async findAll(): Promise<OpportunityEntity[]> {
    return this.opportunityRepository.find();
  }

  public async findOne(id: string): Promise<OpportunityEntity> {
    return this.opportunityRepository.findOne({
      where: { id },
    });
  }

  public async create(
    opportunity: OpportunityEntity,
  ): Promise<OpportunityEntity> {
    return this.opportunityRepository.save(opportunity);
  }

  public async update(
    id: string,
    opportunity: OpportunityEntity,
  ): Promise<void> {
    await this.opportunityRepository.update(id, opportunity);
  }

  public async remove(id: string): Promise<void> {
    await this.opportunityRepository.delete(id);
  }
}
