import { ShareEntityRelation } from '../acl.service';
import { ParseSharePipe } from './parse-share.pipe';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParseShareWithActorPipe extends ParseSharePipe {
  protected readonly relations: ShareEntityRelation[] = ['resource', 'actor'];
}
