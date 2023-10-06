import { NoteEntity } from '../../rvn-notes/entities/note.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';

export class NoteAssignedToOpportunityEvent {
  public constructor(
    public readonly noteEntity: NoteEntity,
    public readonly opportunityId: string,
    public readonly assignedBy: UserEntity,
  ) {}
}
