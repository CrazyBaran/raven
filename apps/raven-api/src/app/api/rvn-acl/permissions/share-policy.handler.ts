import { Query } from 'express-serve-static-core';

import { ShareAbility } from '../casl/ability.factory';

export interface PolicyRequestContext {
  params: Record<string, string>;
  query: Query;
  body: Record<string, string>;
}

interface PolicyHandler {
  handle(ability: ShareAbility, context: PolicyRequestContext): boolean;
}

type PolicyHandlerCallback = (
  ability: ShareAbility,
  context: PolicyRequestContext,
) => boolean;

export type SharePolicyHandler = PolicyHandler | PolicyHandlerCallback;
