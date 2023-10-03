import { EntityManager } from 'typeorm';

import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { AzureAdPayload } from '@app/rvns-auth';
import { UserEntity } from '../../api/rvn-users/entities/user.entity';
import { environment } from '../../../environments/environment';

@Injectable()
export class ParseUserFromIdentityPipe
  implements PipeTransform<AzureAdPayload, Promise<UserEntity>>
{
  @Inject(EntityManager)
  protected entityManager: EntityManager;

  public async transform(user: AzureAdPayload): Promise<UserEntity> {
    const azureId = user[environment.azureAd.tokenKeys.azureId];
    const userEntity = await this.entityManager.findOne(UserEntity, {
      where: {
        azureId,
      },
    });
    if (!userEntity) {
      throw new NotFoundException(
        `Unable to find user with azure id: "${azureId}"`,
      );
    }
    return userEntity;
  }
}
