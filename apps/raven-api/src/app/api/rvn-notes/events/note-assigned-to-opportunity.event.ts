import { UserEntity } from '../../rvn-users/entities/user.entity';
import { NoteEntity } from '../entities/note.entity';

export class NoteAssignedToOpportunityEvent {
  public constructor(
    public readonly noteEntity: NoteEntity,
    public readonly opportunityId: string,
    public readonly assignedBy: UserEntity,
  ) {}
}
