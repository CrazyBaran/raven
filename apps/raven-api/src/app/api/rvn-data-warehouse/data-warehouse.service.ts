import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';

@Injectable()
export class DataWarehouseService {
  public constructor(
    @InjectRepository(CompanyEntity, 'dataWarehouse')
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  public async getCompanies(): Promise<CompanyEntity[]> {
    return this.companyRepository.find({ take: 10 });
  }
}
