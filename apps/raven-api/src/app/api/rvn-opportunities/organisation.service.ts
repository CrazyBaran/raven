import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Organisation } from './entities/organisation.entity';

@Injectable()
export class OrganisationService {
  public constructor(
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,
  ) {}

  public async findAll(): Promise<Organisation[]> {
    return this.organisationRepository.find();
  }

  public async findOne(id: string): Promise<Organisation> {
    return this.organisationRepository.findOne({ where: { id } });
  }

  public async create(organisation: Organisation): Promise<Organisation> {
    return this.organisationRepository.save(organisation);
  }

  public async update(id: string, organisation: Organisation): Promise<void> {
    await this.organisationRepository.update(id, organisation);
  }

  public async remove(id: string): Promise<void> {
    await this.organisationRepository.delete(id);
  }
}
