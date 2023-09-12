import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../users.service';
import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseUsersPipe
  implements PipeTransform<string | string[], Promise<UserEntity[]>>
{
  @Inject(UsersService)
  public readonly service: UsersService;

  public async transform(
    ids: string | string[],
    metadata: ArgumentMetadata
  ): Promise<UserEntity[]> {
    if (typeof ids === 'string') {
      ids = Array.of(ids);
    }
    const users = await this.service.list({ ids });
    if (ids.length !== users.length) {
      throw new BadRequestException(
        `"${metadata.data}" contains not existing user ids`
      );
    }
    return users;
  }
}
