import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyStatus, PagedDataWithExtras, ShortlistType } from 'rvns-shared';
import { In, Not, Repository, SelectQueryBuilder } from 'typeorm';
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
  type?: ShortlistType;
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
  private readonly nonRemovableShortlistTypes = [
    ShortlistType.PERSONAL,
    ShortlistType.MAIN,
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
    userEntity?: UserEntity,
  ): Promise<PagedDataWithExtras<ShortlistEntity>> {
    const extras = await this.getShortlistsExtras(userEntity);

    const queryBuilder =
      this.shortlistRepository.createQueryBuilder('shortlists');

    if (extras.length) {
      queryBuilder.where({
        id: Not(In(extras.map((excludedList) => excludedList.id))),
      });
    }
    this.addStatsQuery(queryBuilder);

    if (options?.organisationId) {
      queryBuilder.andWhere('organisations.id = :organisationId', {
        organisationId: options.organisationId,
      });
    }
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
      extras,
    } as PagedDataWithExtras<ShortlistEntity>;
  }

  public async findOne(id: string): Promise<ShortlistEntity> {
    const queryBuilder =
      this.shortlistRepository.createQueryBuilder('shortlists');

    queryBuilder.where({ id });
    this.addStatsQuery(queryBuilder);

    const shortlist = await queryBuilder.getOne();
    if (!shortlist) {
      throw new NotFoundException();
    }

    if (shortlist.type === ShortlistType.MAIN) {
      const totalStats = await this.getTotalStats();
      shortlist.inPipelineCount += totalStats.inPipelineCount;
      shortlist.organisationsCount += totalStats.organisationsCount;
    }

    return shortlist;
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

    if (options.type) {
      shortlist.type = options.type;
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
    const shortlistToRemove = await this.shortlistRepository.findOne({
      where: { id },
    });

    if (!shortlistToRemove) {
      throw new NotFoundException();
    }

    if (
      this.nonRemovableShortlistTypes.indexOf(shortlistToRemove.type) !== -1
    ) {
      throw new ForbiddenException('This shortlist cannot be deleted.');
    }

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

  public async createPersonalShortlistForUser(
    userId: string,
    name: string,
  ): Promise<ShortlistEntity> {
    const userData = new UserEntity();
    userData.id = userId;

    return await this.create(
      {
        name: `${name} Personal Shortlist`,
        description: `Personal shortlist of user ${name}`,
        type: ShortlistType.PERSONAL,
      },
      userData,
    );
  }

  public async getUserPersonalShortlist(
    userId: string,
  ): Promise<ShortlistEntity> {
    const queryBuilder =
      this.shortlistRepository.createQueryBuilder('shortlists');

    queryBuilder.where({ creatorId: userId, type: ShortlistType.PERSONAL });
    this.addStatsQuery(queryBuilder);

    return queryBuilder.getOne();
  }

  public async getMainShortlist(withStats = true): Promise<ShortlistEntity> {
    const queryBuilder =
      this.shortlistRepository.createQueryBuilder('shortlists');

    queryBuilder.where({ type: ShortlistType.MAIN });
    queryBuilder.limit(1);
    const mainShortlist = await queryBuilder.getOne();
    if (mainShortlist && withStats) {
      const totalStats = await this.getTotalStats();

      mainShortlist.inPipelineCount = totalStats.inPipelineCount;
      mainShortlist.organisationsCount = totalStats.organisationsCount;
    }

    return mainShortlist;
  }

  private addStatsQuery(
    queryBuilder: SelectQueryBuilder<ShortlistEntity>,
  ): SelectQueryBuilder<ShortlistEntity> {
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

    return queryBuilder;
  }

  private async getTotalStats(): Promise<Partial<ShortlistEntity>> {
    const statsQueryBuilder =
      this.organisationRepository.createQueryBuilder('shortlisted');
    statsQueryBuilder.leftJoin('shortlisted.shortlists', 'shortlists');
    statsQueryBuilder.leftJoin('shortlisted.opportunities', 'opportunities');

    statsQueryBuilder.where('shortlists.type IN (:...shortlistTypes)', {
      shortlistTypes: [ShortlistType.CUSTOM, ShortlistType.PERSONAL],
    });

    statsQueryBuilder.loadRelationCountAndMap(
      'shortlisted.inPipelineCount',
      'shortlisted.opportunities',
      'opportunity',
      (qb) =>
        qb
          .leftJoin('opportunity.pipelineStage', 'pipelineStage')
          .andWhere('pipelineStage.relatedCompanyStatus IN (:...statuses)', {
            statuses: this.inPipelineStatuses,
          }),
    );

    const [organisations, totalCount] =
      await statsQueryBuilder.getManyAndCount();

    const inPipelineCount = organisations.reduce(
      (a, b) => a + b['inPipelineCount'],
      0,
    );

    return {
      inPipelineCount: Number(inPipelineCount),
      organisationsCount: totalCount,
    };
  }

  private async getShortlistsExtras(
    userEntity?: UserEntity,
  ): Promise<ShortlistEntity[]> {
    const extras = [];
    if (userEntity?.id) {
      const personalShortlist = await this.getUserPersonalShortlist(
        userEntity.id,
      );

      !!personalShortlist && extras.push(personalShortlist);
    }

    const mainShortlist = await this.getMainShortlist();
    !!mainShortlist && extras.push(mainShortlist);

    return extras;
  }
}