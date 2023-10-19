import { Injectable } from '@nestjs/common';
import { ShareEntityRelation } from '../acl.service';
import { ParseSharePipe } from './parse-share.pipe';

@Injectable()
export class ParseShareWithActorPipe extends ParseSharePipe {
  protected readonly relations: ShareEntityRelation[] = ['resource', 'actor'];
}
