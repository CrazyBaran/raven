import { EntityManager } from 'typeorm';

import { AzureAdPayload } from '@app/rvns-auth';
import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { environment } from '../../../environments/environment';
import { UserEntity } from '../../api/rvn-users/entities/user.entity';

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
