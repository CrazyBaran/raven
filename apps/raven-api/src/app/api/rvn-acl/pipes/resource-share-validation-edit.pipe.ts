import { ShareAction } from '../enums/share-action.enum';
import { ResourceShareValidationPipe } from './resource-share-validation.pipe';

export class ResourceShareValidationEditPipe extends ResourceShareValidationPipe {
  protected actionOverride = ShareAction.Edit;
}
