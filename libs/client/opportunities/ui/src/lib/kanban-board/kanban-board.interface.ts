/* eslint-disable @nx/enforce-module-boundaries */
//TODO: create model library

import { Observable } from 'rxjs';
import { OpportunityCard } from '../opportunities-card/opportunities-card.component';

export interface OpportunityRow {
  id: string;
  source: Observable<OpportunityCard>;
}

export interface ColumnData {
  id: string;
  name: string;
  color?: {
    color: string;
    palette: string;
  };
  length: number;
  cards?: OpportunityCard[];
  backgroundColor?: string;
}
