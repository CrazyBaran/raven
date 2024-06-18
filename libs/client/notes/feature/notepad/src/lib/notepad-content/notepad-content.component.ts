/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoteStoreFacade } from '@app/client/notes/state';
import { ComponentData } from '@app/client/shared/dynamic-renderer/data-access';

import {
  TemplateActions,
  TemplatesStoreFacade,
} from '@app/client/templates/data-access';
import { Actions, ofType } from '@ngrx/effects';
import {
  DialogResult,
  DialogService,
  WindowRef,
} from '@progress/kendo-angular-dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { NotesActions } from '@app/client/notes/state';
import {
  NotepadForm,
  NotepadFormComponent,
  TITLE_FIELD,
} from '@app/client/notes/ui';
import { ImagePathDictionaryService } from '@app/client/shared/storage/data-access';
import { ControlInvalidPipe } from '@app/client/shared/ui-pipes';
import { Store } from '@ngrx/store';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxPush } from '@rx-angular/template/push';
import * as _ from 'lodash';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-notepad-content',
  standalone: true,
  imports: [
    CommonModule,
    NotepadFormComponent,
    ReactiveFormsModule,
    ButtonsModule,
    LoaderModule,
    ControlInvalidPipe,
    RxPush,
  ],
  templateUrl: './notepad-content.component.html',
  styleUrls: ['./notepad-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class NotepadContentComponent implements OnInit {
  public organisationId?: string;
  public opportunityId?: string;

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  @ViewChild(NotepadFormComponent)
  public notepadFormComponent: NotepadFormComponent;

  protected templateFacade = inject(TemplatesStoreFacade);
  protected noteFacade = inject(NoteStoreFacade);
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected windowRef = inject(WindowRef, { optional: true });
  protected dialogService = inject(DialogService);
  protected imagePathDictionaryService = inject(ImagePathDictionaryService);

  //TODO: MOVE TO COMPONENT STORE
  protected defaultTemplate = this.templateFacade.defaultTemplate;
  protected isCreatePending = this.noteFacade.isCreatingNote;
  protected router = inject(Router);

  protected activatedRoute = inject(ActivatedRoute);
  protected fb = inject(FormBuilder);
  protected notepadForm = new FormControl<NotepadForm>({
    template: null,
    notes: {},
    peopleTags: [],
    tags: [],
  });

  public ngOnInit(): void {
    if (this.opportunityId && this.organisationId) {
      this.notepadForm.patchValue({
        ...this.notepadForm.value!,
        tags: [
          {
            opportunityTagId: this.opportunityId,
            organisationId: this.organisationId,
          },
        ],
      });
    } else if (this.organisationId) {
      this.notepadForm.patchValue({
        ...this.notepadForm.value!,
        tags: [this.organisationId],
      });
    }
  }
  public constructor() {
    this.store.dispatch(TemplateActions.getTemplateIfNotLoaded());
  }

  public get hasChanges(): boolean {
    const { notes, template, tags, peopleTags } = this.notepadForm.value ?? {};
    return !!(
      tags?.length ||
      peopleTags?.length ||
      template?.id ||
      _.values(notes)?.filter(Boolean)?.length
    );
  }

  public submit(closeNotepad = true): void {
    const imageDictionary =
      this.imagePathDictionaryService.getImageDictionary();
    const fields = Object.entries(this.notepadForm.value?.notes ?? {})
      .filter(([key, value]) => key !== TITLE_FIELD.id)
      .map(([id, value]) => {
        const clearedValue = Object.entries(imageDictionary).reduce(
          (acc, [fileName, sasUrl]) => {
            return acc
              .replace(new RegExp('&amp;', 'g'), '&')
              .replace(sasUrl, fileName);
          },
          value ?? '',
        );
        return { id, value: clearedValue || '' };
      });

    const { template, notes, tags, peopleTags, rootVersionId } =
      this.notepadForm.value!;
    const payload = {
      name: notes['TITLE'] || '',
      templateId: template?.id || this.defaultTemplate().id,
      fields: fields,
      tagIds: [
        ...(peopleTags ?? []),
        ...(tags ?? [])
          .filter((t) => typeof t === 'string')
          .map((t) => String(t).replace('_company', '')), //TODO: REFACTOR SUBMIT()
      ],
      companyOpportunityTags: (tags ?? []).filter(
        (t) => typeof t !== 'string',
      ) as {
        organisationId: string;
        opportunityTagId: string;
      }[],
      rootVersionId,
    };

    this.noteFacade.createNote(payload);

    this.actions$
      .pipe(
        ofType(NotesActions.createNoteSuccess),
        filter(({ data }) => data.name === payload.name),
        take(1),
      )
      .subscribe((data) => {
        if (!closeNotepad) {
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
              'note-details': data.data.id,
              'note-edit': true,
            },
            queryParamsHandling: 'merge',
          });
        }
        this.windowRef?.close();
      });
  }

  public close(): void {
    if (this.hasChanges) {
      this.dialogService
        .open({
          appendTo: this.containerRef,
          title: 'Leave without publishing?',
          width: 350,
          content:
            'Any progress will be lost without publishing first. Are you sure you want to continue?',
          actions: [
            { text: 'No' },
            {
              text: 'Yes, leave without publishing',
              primary: true,
              themeColor: 'primary',
            },
          ],
        })
        .result.subscribe((res: DialogResult) => {
          if ('text' in res && res.text === 'Yes, leave without publishing') {
            this.windowRef?.close();
          }
        });
    } else {
      this.windowRef?.close();
    }
  }
}

export const componentDataResolver = (data: ComponentData): unknown => {
  return {
    organisationId: data?.['organisationId'],
    opportunityId: data?.['opportunityId'],
  };
};
