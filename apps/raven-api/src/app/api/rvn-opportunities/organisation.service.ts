import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganisationEntity } from './entities/organisation.entity';

@Injectable()
export class OrganisationService {
  public constructor(
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
  ) {}

  public async findAll(): Promise<OrganisationEntity[]> {
    return this.organisationRepository.find();
  }

  public async findOne(id: string): Promise<OrganisationEntity> {
    return this.organisationRepository.findOne({ where: { id } });
  }

  public async create(
    organisation: OrganisationEntity,
  ): Promise<OrganisationEntity> {
    return this.organisationRepository.save(organisation);
  }

  public async update(
    id: string,
    organisation: OrganisationEntity,
  ): Promise<void> {
    await this.organisationRepository.update(id, organisation);
  }

  public async remove(id: string): Promise<void> {
    await this.organisationRepository.delete(id);
  }
}
