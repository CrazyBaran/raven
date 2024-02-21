import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyStatus, PagedData } from 'rvns-shared';
import { In, Repository } from 'typeorm';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { BulkAddOrganisationsDto } from './dto/bulk-add-organisations.dto';
import { DeleteOrganisationFromShortlistDto } from './dto/delete-organisation-from-shortlist.dto';
import { ShortlistOrganisationEntity } from './entities/shortlist-organisation.entity';
import { ShortlistEntity } from './entities/shortlist.entity';
import {
  GetShortlistsOptions,
  defaultGetShortlistsOptions,
} from './interfaces/get-shortlists.options';

interface CreateShortlistOptions {
  name: string;
  description?: string;
  organisations?: string[];
}

interface UpdateShortlistOptions {
  name?: string;
  description?: string;
  organisations?: string[];
}

@Injectable()
export class ShortlistsService {
  private readonly inPipelineStatuses = [
    CompanyStatus.LIVE_OPPORTUNITY,
    CompanyStatus.MET,
    CompanyStatus.OUTREACH,
  ];

  public constructor(
    @InjectRepository(ShortlistEntity)
    private readonly shortlistRepository: Repository<ShortlistEntity>,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    @InjectRepository(ShortlistOrganisationEntity)
    private readonly shortlistOrganisationRepository: Repository<ShortlistOrganisationEntity>,
  ) {}

  public async findAll(
    options: GetShortlistsOptions,
  ): Promise<PagedData<ShortlistEntity>> {
    const queryBuilder =
      this.shortlistRepository.createQueryBuilder('shortlists');

    queryBuilder.leftJoinAndSelect('shortlists.organisations', 'organisations');
    queryBuilder.loadRelationCountAndMap(
      'shortlists.organisationsCount',
      'shortlists.organisations',
    );
    queryBuilder.loadRelationCountAndMap(
      'shortlists.inPipelineCount',
      'shortlists.organisations',
      'organisation',
      (qb) =>
        qb
          .leftJoin('organisation.opportunities', 'opportunities')
          .leftJoin('opportunities.pipelineStage', 'pipelineStage')
          .andWhere('pipelineStage.relatedCompanyStatus IN (:...statuses)', {
            statuses: this.inPipelineStatuses,
          }),
    );

    const searchString = options.query
      ? `%${options.query.toLowerCase()}%`
      : undefined;

    if (searchString) {
      queryBuilder
        .where(`LOWER(shortlists.name) LIKE :nameSearch`, {
          nameSearch: searchString,
        })
        .orWhere(`LOWER(shortlists.description) LIKE :descriptionSearch`, {
          descriptionSearch: searchString,
        });
    }

    if (options.skip || options.take) {
      queryBuilder
        .skip(options.skip ?? defaultGetShortlistsOptions.skip)
        .take(options.take ?? defaultGetShortlistsOptions.take);
    }

    queryBuilder.addOrderBy(
      'shortlists.name',
      options.direction ?? defaultGetShortlistsOptions.direction,
    );

    const [shortlists, count] = await queryBuilder.getManyAndCount();

    return {
      items: shortlists,
      total: count,
    } as PagedData<ShortlistEntity>;
  }

  public async findOne(id: string): Promise<ShortlistEntity> {
    const queryBuilder =
      this.shortlistRepository.createQueryBuilder('shortlists');

    queryBuilder.where({ id });
    queryBuilder.limit(1);
    queryBuilder.leftJoinAndSelect('shortlists.organisations', 'organisations');
    queryBuilder.loadRelationCountAndMap(
      'shortlists.organisationsCount',
      'shortlists.organisations',
    );
    queryBuilder.loadRelationCountAndMap(
      'shortlists.inPipelineCount',
      'shortlists.organisations',
      'organisation',
      (qb) =>
        qb
          .leftJoin('organisation.opportunities', 'opportunities')
          .leftJoin('opportunities.pipelineStage', 'pipelineStage')
          .andWhere('pipelineStage.relatedCompanyStatus IN (:...statuses)', {
            statuses: this.inPipelineStatuses,
          }),
    );

    return queryBuilder.getOne();
  }

  public async create(
    options: CreateShortlistOptions,
    userData: UserEntity,
  ): Promise<ShortlistEntity> {
    const shortlist = new ShortlistEntity();
    shortlist.name = options.name;
    shortlist.description = options.description || '';
    shortlist.creatorId = userData.id;

    if (options.organisations?.length) {
      const queryBuilder =
        this.organisationRepository.createQueryBuilder('organisations');
      queryBuilder.where('organisations.id IN (:...ids)', {
        ids: options.organisations,
      });

      const organisations = await queryBuilder.getMany();
      shortlist.organisations = organisations;
    }

    return await this.shortlistRepository.save(shortlist);
  }

  public async bulkAddOrganisationsToShortlists(
    options: BulkAddOrganisationsDto,
  ): Promise<void> {
    const shortlists = await this.shortlistRepository.find({
      where: {
        id: In(options.shortlistsIds),
      },
      relations: ['organisations'],
    });
    const organisations = await this.organisationRepository.find({
      where: {
        id: In(options.organisationsIds),
      },
      relations: ['shortlists'],
    });

    const relationsToAdd: ShortlistOrganisationEntity[] = [];
    for (const shortlist of shortlists) {
      relationsToAdd.push(
        ...organisations.map((organisation) =>
          ShortlistOrganisationEntity.create({
            organisationId: organisation.id,
            shortlistId: shortlist.id,
          }),
        ),
      );
    }
    await this.shortlistOrganisationRepository.save(relationsToAdd);
  }

  public async update(
    shortlistEntity: ShortlistEntity,
    options: UpdateShortlistOptions,
  ): Promise<ShortlistEntity> {
    if (options.name) {
      shortlistEntity.name = options.name;
    }

    if (options.description) {
      shortlistEntity.description = options.description;
    }

    delete shortlistEntity.organisations;

    const currentRelations = await this.shortlistOrganisationRepository.find({
      where: {
        shortlistId: shortlistEntity.id,
      },
    });

    return await this.shortlistOrganisationRepository.manager.transaction(
      async (tem) => {
        if (options.organisations) {
          const relationsToAdd = [];
          await tem.remove(currentRelations);
          for (const organisation of options.organisations) {
            relationsToAdd.push(
              ShortlistOrganisationEntity.create({
                organisationId: organisation,
                shortlistId: shortlistEntity.id,
              }),
            );
          }

          await tem.save(relationsToAdd);
        }

        return await tem.save(shortlistEntity);
      },
    );
  }

  public async remove(id: string): Promise<void> {
    await this.shortlistRepository.delete(id);
  }

  public async deleteOrganisationsFromShortlist(
    shortlistEntity: ShortlistEntity,
    options: DeleteOrganisationFromShortlistDto,
  ): Promise<ShortlistEntity> {
    if (options.organisations?.length) {
      const relatedEntities = await this.shortlistOrganisationRepository.find({
        where: {
          shortlistId: shortlistEntity.id,
          organisationId: In(options.organisations),
        },
      });

      await this.shortlistOrganisationRepository.remove(relatedEntities);
    }

    return await this.shortlistRepository.findOne({
      where: {
        id: shortlistEntity.id,
      },
      relations: ['organisations'],
    });
  }
}
