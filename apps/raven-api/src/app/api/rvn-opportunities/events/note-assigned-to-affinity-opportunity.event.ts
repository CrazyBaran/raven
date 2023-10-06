import { NoteEntity } from '../../rvn-notes/entities/note.entity';
import { UserEntity } from '../../rvn-users/entities/user.entity';

export class NoteAssignedToAffinityOpportunityEvent {
  public constructor(
    public readonly noteEntity: NoteEntity,
    public readonly opportunityAffinityInternalId: number,
    public readonly assignedBy: UserEntity,
  ) {}
}
