import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency, FundManagerRelationStrength, PagedData } from 'rvns-shared';
import { Brackets, Repository } from 'typeorm';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { FundManagerContactEntity } from './entities/fund-manager-contact.entity';
import { FundManagerIndustryEntity } from './entities/fund-manager-industry.entity';
import { FundManagerKeyRelationshipEntity } from './entities/fund-manager-key-relationship.entity';
import { FundManagerEntity } from './entities/fund-manager.entity';
import { GetFundManagersOptions } from './interfaces/get-fund-managers.options';

interface UpdateFundManagerOptions {
  name?: string;
  description?: string;
  strategy?: string;
  geography?: string;
  avgCheckSize?: number;
  avgCheckSizeCurrency?: Currency;
  aum?: number;
  aumCurrency?: Currency;
  relationshipStrength?: FundManagerRelationStrength;
  keyRelationships?: string[];
  industryTags?: TagEntity[];
}

@Injectable()
export class FundManagersService {
  public constructor(
    @InjectRepository(FundManagerEntity)
    private readonly fundManagersRepository: Repository<FundManagerEntity>,
    @InjectRepository(FundManagerKeyRelationshipEntity)
    private readonly fundManagerKeyRelationshipRepository: Repository<FundManagerKeyRelationshipEntity>,
    @InjectRepository(FundManagerIndustryEntity)
    private readonly fundManagerIndustryRepository: Repository<FundManagerIndustryEntity>,
    @InjectRepository(FundManagerContactEntity)
    private readonly fundManagerContactsRepository: Repository<FundManagerContactEntity>,
  ) {}

  public async findAll(
    options: GetFundManagersOptions,
    userEntity?: UserEntity,
  ): Promise<PagedData<FundManagerEntity>> {
    const queryBuilder =
      this.fundManagersRepository.createQueryBuilder('fund_managers');
    queryBuilder
      .leftJoinAndSelect('fund_managers.industryTags', 'indystryTags')
      .leftJoinAndSelect('fund_managers.keyRelationships', 'keyRelationships')
      .leftJoinAndSelect('fund_managers.organisations', 'organisations')
      .leftJoinAndSelect('organisations.organisationDomains', 'domains')
      .leftJoinAndSelect('organisations.dataV1', 'data');

    if (options?.organisationId) {
      queryBuilder.andWhere('organisations.id = :organisationId', {
        organisationId: options.organisationId,
      });
    }
    const searchString = options.query
      ? `%${options.query.toLowerCase()}%`
      : undefined;

    if (searchString) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(fund_managers.name) LIKE :nameSearch`, {
            nameSearch: searchString,
          });
          qb.orWhere(`LOWER(organisations.name) LIKE :organisationSearch`, {
            organisationSearch: searchString,
          });
        }),
      );
    }

    if (options.relationshipStrength) {
      queryBuilder.andWhere(
        'fund_managers.relationStrength = :relationStrength',
        {
          relationStrength: options.relationshipStrength,
        },
      );
    }

    if (options.keyRelationship) {
      queryBuilder.andWhere('keyRelationships.id = :keyRelationship', {
        keyRelationship: options.keyRelationship,
      });
    }

    if (options.filters?.avgCheckSize) {
      if (options.filters.avgCheckSize.min) {
        queryBuilder.andWhere(
          'fund_managers.avgCheckSize >= :minAvgCheckSize',
          {
            minAvgCheckSize: options.filters.avgCheckSize.min,
          },
        );
      }

      if (options.filters.avgCheckSize.max) {
        queryBuilder.andWhere(
          'fund_managers.avgCheckSize <= :maxAvgCheckSize',
          {
            maxAvgCheckSize: options.filters.avgCheckSize.max,
          },
        );
      }

      if (options.filters.avgCheckSize.currency) {
        queryBuilder.andWhere(
          'fund_managers.avgCheckSizeCurrency = :avgCheckSizeCurrency',
          {
            avgCheckSizeCurrency: options.filters.avgCheckSize.currency,
          },
        );
      }
    }

    if (options.filters?.industryTags?.length) {
      const subQuery = this.fundManagersRepository
        .createQueryBuilder('fund_managers')
        .leftJoin('fund_managers.industryTags', 'industryTags')
        .select('fund_managers.id')
        .where('industryTags.id IN (:...industryTags)', {
          industryTags: options.filters.industryTags,
        });

      queryBuilder.andWhere(`fund_managers.id IN (${subQuery.getQuery()})`);
      queryBuilder.setParameters(subQuery.getParameters());
    }

    if (options.filters?.geography?.length) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          options.filters.geography.forEach((value, i) => {
            if (i === 0) {
              qb.andWhere('fund_managers.geography LIKE :name' + i, {
                [`name${i}`]: `%${value}%`,
              });
            } else {
              qb.orWhere('fund_managers.geography LIKE :name' + i, {
                [`name${i}`]: `%${value}%`,
              });
            }
          });
        }),
      );
    }

    if (options.skip || options.take) {
      queryBuilder.skip(options.skip).take(options.take);
    }

    queryBuilder.addOrderBy('fund_managers.name', options.direction);

    const [managers, count] = await queryBuilder.getManyAndCount();

    return {
      items: managers,
      total: count,
    } as PagedData<FundManagerEntity>;
  }

  public async findOne(id: string): Promise<FundManagerEntity> {
    const queryBuilder =
      this.fundManagersRepository.createQueryBuilder('fund_managers');
    queryBuilder
      .leftJoinAndSelect('fund_managers.industryTags', 'indstryTags')
      .leftJoinAndSelect('fund_managers.keyRelationships', 'keyRelationships')
      .leftJoinAndSelect('fund_managers.organisations', 'organisations')
      .leftJoin('organisations.organisationDomains', 'domains')
      .addSelect('domains.domain')
      .leftJoin('organisations.dataV1', 'data')
      .addSelect([
        'data.fundingLastFundingRound',
        'data.fundingLastFundingDate',
        'data.fundingLastFundingAmount',
        'data.fundingTotalFundingAmount',
      ])
      .leftJoin('organisations.shortlists', 'shortlists')
      .addSelect(['shortlists.id', 'shortlists.name'])
      .leftJoin('data.investors', 'investors')
      .addSelect(['investors.name'])
      .orderBy('organisations.name', 'ASC');

    queryBuilder.where({ id });

    const fundManager = await queryBuilder.getOne();
    if (!fundManager) {
      throw new NotFoundException();
    }

    return fundManager;
  }

  public async update(
    fundManagerEntity: FundManagerEntity,
    options: UpdateFundManagerOptions,
    userEntity?: UserEntity,
  ): Promise<FundManagerEntity> {
    if (options.name) {
      fundManagerEntity.name = options.name;
    }

    if (options.description !== undefined) {
      fundManagerEntity.description = options.description;
    }

    if (options.geography !== undefined) {
      fundManagerEntity.geography = options.geography;
    }

    if (options.strategy !== undefined) {
      fundManagerEntity.strategy = options.strategy;
    }

    if (options.avgCheckSize !== undefined) {
      fundManagerEntity.avgCheckSize = options.avgCheckSize;
    }

    if (options.avgCheckSizeCurrency !== undefined) {
      fundManagerEntity.avgCheckSizeCurrency = options.avgCheckSizeCurrency;
    }

    if (options.aum !== undefined) {
      fundManagerEntity.aum = options.aum;
    }

    if (options.aumCurrency !== undefined) {
      fundManagerEntity.aumCurrency = options.aumCurrency;
    }

    if (options.geography !== undefined) {
      fundManagerEntity.geography = options.geography;
    }

    if (options.relationshipStrength !== undefined) {
      fundManagerEntity.relationStrength = options.relationshipStrength;
    }

    if (options.keyRelationships?.length) {
      await this.fundManagerKeyRelationshipRepository.manager.transaction(
        async (tem) => {
          const currentRelations =
            await this.fundManagerKeyRelationshipRepository.find({
              where: {
                fundManagerId: fundManagerEntity.id,
              },
            });
          const relationsToAdd = [];
          await tem.remove(currentRelations);
          for (const user of options.keyRelationships) {
            relationsToAdd.push(
              FundManagerKeyRelationshipEntity.create({
                userId: user,
                fundManagerId: fundManagerEntity.id,
              }),
            );
          }

          await tem.save(relationsToAdd);
        },
      );
    }

    if (options.industryTags?.length) {
      await this.fundManagerIndustryRepository.manager.transaction(
        async (tem) => {
          const currentRelations =
            await this.fundManagerIndustryRepository.find({
              where: {
                fundManagerId: fundManagerEntity.id,
              },
            });
          const relationsToAdd = [];
          await tem.remove(currentRelations);
          for (const tag of options.industryTags) {
            relationsToAdd.push(
              FundManagerIndustryEntity.create({
                tagId: tag.id,
                fundManagerId: fundManagerEntity.id,
              }),
            );
          }

          await tem.save(relationsToAdd);
        },
      );
    }

    delete fundManagerEntity.organisations;
    // delete fundManagerEntity.industryTags;
    // delete fundManagerEntity.keyRelationships;

    return this.fundManagersRepository.save(fundManagerEntity);
  }

  public async findAllContacts(
    id: string,
    skip: number,
    take: number,
  ): Promise<PagedData<FundManagerContactEntity>> {
    const queryBuilder =
      this.fundManagerContactsRepository.createQueryBuilder('contacts');
    queryBuilder.skip(skip || 0);
    queryBuilder.take(take || 10);
    queryBuilder.where('contacts.fundManagerId = :id', { id });

    const [contacts, count] = await queryBuilder.getManyAndCount();

    return {
      items: contacts,
      total: count,
    } as PagedData<FundManagerContactEntity>;
  }

  public createContact(
    fundManager: FundManagerEntity,
    dto: CreateContactDto,
  ): Promise<FundManagerContactEntity> {
    const fmc = new FundManagerContactEntity();
    fmc.name = dto.name;
    fmc.position = dto.position;
    fmc.relationStrength = dto.relationStrength;
    fmc.email = dto.email;
    fmc.linkedin = dto.linkedin;
    fmc.fundManager = fundManager;
    return this.fundManagerContactsRepository.save(fmc);
  }

  public findOneContact(id: string): Promise<FundManagerContactEntity> {
    return this.fundManagerContactsRepository.findOneOrFail({ where: { id } });
  }

  public updateContact(
    contact: FundManagerContactEntity,
    dto: UpdateContactDto,
  ): Promise<FundManagerContactEntity> {
    if (dto.name !== undefined) {
      contact.name = dto.name;
    }
    if (dto.position !== undefined) {
      contact.position = dto.position;
    }
    if (dto.relationStrength !== undefined) {
      contact.relationStrength = dto.relationStrength;
    }
    if (dto.email !== undefined) {
      contact.email = dto.email;
    }
    if (dto.linkedin !== undefined) {
      contact.linkedin = dto.linkedin;
    }
    return this.fundManagerContactsRepository.save(contact);
  }

  public async removeOneContact(id: string): Promise<boolean> {
    await this.fundManagerContactsRepository.delete(id);
    return true;
  }
}
