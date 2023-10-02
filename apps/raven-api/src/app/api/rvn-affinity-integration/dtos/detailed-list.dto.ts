import { ListDto } from './list.dto';
import { FieldDto } from './field.dto';

export class DetailedListDto extends ListDto {
  public fields: FieldDto[];
}
