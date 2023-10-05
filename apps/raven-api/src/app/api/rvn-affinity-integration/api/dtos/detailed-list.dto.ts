import { FieldDto } from './field.dto';
import { ListDto } from './list.dto';

export class DetailedListDto extends ListDto {
  public fields: FieldDto[];
}
