import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-ioredis-yet';

import { TagTypeEnum } from '@app/rvns-tags';
import { In, Repository } from 'typeorm';
import { PeopleTagEntity } from '../rvn-tags/entities/tag.entity';
import { UserEntity } from './entities/user.entity';
import { USERS_CACHE } from './users.constant';
import { UsersService } from './users.service';

@Injectable()
export class UsersCacheService implements OnModuleInit {
  public constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(PeopleTagEntity)
    private readonly tagsRepository: Repository<PeopleTagEntity>,
  ) {}

  private get store(): RedisStore {
    return this.cacheManager.store as RedisStore;
  }
  public async onModuleInit(): Promise<void> {
    const users = await this.usersService.list({});
    await this.ensureTagsForUsers(users);
    await this.reset();
    await this.addOrReplaceMany(users);
  }

  public async addOrReplace(user: UserEntity): Promise<void> {
    await this.store.client.hset(
      USERS_CACHE,
      user.azureId.toString(),
      JSON.stringify(user),
    );
  }

  public async get(azureId: string): Promise<UserEntity | null> {
    const rawData = await this.store.client.hget(USERS_CACHE, azureId);
    return rawData ? JSON.parse(rawData) : null;
  }

  private async addOrReplaceMany(data: UserEntity[]): Promise<void> {
    const pipeline = this.store.client.pipeline();
    for (const user of data) {
      pipeline.hset(USERS_CACHE, user.azureId.toString(), JSON.stringify(user));
    }
    await pipeline.exec();
  }

  private async reset(): Promise<void> {
    if (await this.store.client.exists(USERS_CACHE)) {
      await this.store.client.del(USERS_CACHE);
    }
  }

  private async ensureTagsForUsers(users: UserEntity[]): Promise<void> {
    const tags = await this.tagsRepository.find({
      where: { userId: In(users.map((u) => u.id)) },
    });
    const usersWithMissingTags = users.filter((u) =>
      tags.every((t) => t.userId !== u.id),
    );
    if (usersWithMissingTags.length > 0) {
      await this.tagsRepository.manager.transaction(async (tem) => {
        for (const user of usersWithMissingTags) {
          const tag = new PeopleTagEntity();
          tag.name = user.name;
          tag.type = TagTypeEnum.People;
          tag.userId = user.id;
          await tem.save(tag);
        }
      });
    }
  }
}
