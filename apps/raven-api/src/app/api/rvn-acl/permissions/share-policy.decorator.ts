import { SharePolicyHandler } from './share-policy.handler';
import { SetMetadata } from '@nestjs/common';
import { CustomDecorator } from '@nestjs/common/decorators/core/set-metadata.decorator';

export const CHECK_SHARE_KEY = 'check_share_policy';
export const CheckShare = (
  ...handlers: SharePolicyHandler[]
): CustomDecorator => SetMetadata(CHECK_SHARE_KEY, handlers);
