import { OpportunityData } from '@app/rvns-opportunities';
import { Observable, Subject } from 'rxjs';

export type OpportunityDetails = Pick<
  OpportunityData,
  'id' | 'fields' | 'organisation'
>;

export interface OpportunityRow {
  id: string;
  source: Observable<OpportunityDetails>;
}

export interface ColumnData {
  id: string;
  name: string;
  color: {
    color: string;
    palette: string;
  };
  length$: Observable<number>;
  data$: Observable<OpportunityRow[]>;
  renderSubject: Subject<void>;
  onceRendered$: Observable<boolean>;
}
