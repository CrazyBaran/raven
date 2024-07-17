/* eslint-disable @nx/enforce-module-boundaries */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  input,
  OnInit,
  signal,
} from '@angular/core';

import { delayedFadeIn, TilelayoutItemComponent } from '@app/client/shared/ui';
import { Store } from '@ngrx/store';

import { trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesTreelistContainerComponent } from '@app/client/files/feature/files-table';
import {
  RelatedNoteComponent,
  RelatedNoteSkeletonComponent,
  RelatedNotesTableComponent,
  StatusIndicatorState,
} from '@app/client/opportunities/ui';
import { RecreateViewDirective } from '@app/client/shared/ui-directives';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { PDFContentComponent, PDFPageConfig } from '../../../../pdf-export/src';
import { selectOpportunitiesRelatedNotesViewModel } from './opportunities-related-notes.selectors';
import { RelatedFilesComponent } from './related-files/related-files.component';

export type RelatedGroup = 'notes' | 'files' | 'export-pdf';

@Component({
  selector: 'app-related-notes-container',
  standalone: true,
  imports: [
    NgClass,
    TilelayoutItemComponent,
    ButtonModule,
    RelatedNoteSkeletonComponent,
    RelatedNotesTableComponent,
    RelatedNoteComponent,
    RecreateViewDirective,
    ButtonGroupModule,
    FilesTreelistContainerComponent,
    RelatedFilesComponent,
    PDFExportModule,
    PDFContentComponent,
  ],
  templateUrl: './related-notes-container.component.html',
  styleUrls: ['./related-notes-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('delayedFadeIn', delayedFadeIn())],
})
export class RelatedNotesContainerComponent implements OnInit {
  public relatedNotesExpanded = signal<boolean>(false);

  public group = signal<RelatedGroup>('export-pdf');

  public drawerConfiguration = input<any>({});

  @Input()
  public tabNavigated: Subject<string>;
  protected router = inject(Router);

  protected activeRoute = inject(ActivatedRoute);

  protected store = inject(Store);
  public config = PDFPageConfig;

  public ngOnInit() {
    this.tabNavigated?.subscribe?.((activeTab) => {
      if (this.shouldHideDrawerSection(this.group(), activeTab)) {
        this.group.set('export-pdf');
      }
    });
  }

  protected state = signal(
    {
      disabledForm: false,
      updatingField: null as null | string,
      state: 'none' as StatusIndicatorState,
    },
    {
      equal: _.isEqual,
    },
  );

  protected vm = this.store.selectSignal(
    selectOpportunitiesRelatedNotesViewModel,
  );

  protected relatedNoteView = computed(
    (): 'loading' | 'note' | 'empty' | 'table' | 'collapsed' => {
      if (!this.relatedNotesExpanded()) {
        return 'collapsed';
      }
      return this.vm().visibleNoteWithFields
        ? 'note'
        : this.vm().notes?.length
          ? 'table'
          : 'empty';
    },
    {},
  );
  public getExportFilename(): string {
    return `test_briefing_materials-RAVEN`;
  }

  public shouldHideDrawerSection(
    section: string,
    groupLabel?: string,
  ): boolean {
    const label = groupLabel ?? this.drawerConfiguration()?.activeTab.label;
    return this.drawerConfiguration()?.hideConfiguration[section]?.some(
      (s: any) => s.label === label,
    );
  }

  protected toggleRelatedNotesExpand(): void {
    this.relatedNotesExpanded.update((expanded) => !expanded);
  }

  protected onCollapse(): void {
    this.relatedNotesExpanded.set(false);
  }

  protected onExpand(group?: RelatedGroup): void {
    this.relatedNotesExpanded.set(true);
    group && this.group.set(group);
  }

  protected onPageChange($event: number): void {
    this.router.navigate([], {
      queryParams: { noteIndex: $event },
      queryParamsHandling: 'merge',
      relativeTo: this.activeRoute,
    });
  }
}
