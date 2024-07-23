/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  TemplateRef,
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
  DialogsModule,
  WindowMaximizeActionDirective,
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
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { exportIcon, xIcon } from '@progress/kendo-svg-icons';
import { RxPush } from '@rx-angular/template/push';
import * as _ from 'lodash';
import { filter, take } from 'rxjs';
import { selectQueryParam } from '../../../../../../shared/util-router/src';

@Component({
  selector: 'app-notepad-content',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    NotepadFormComponent,
    ReactiveFormsModule,
    ButtonsModule,
    LoaderModule,
    ControlInvalidPipe,
    RxPush,
    DialogsModule,
  ],
  templateUrl: './notepad-content.component.html',
  styleUrls: ['./notepad-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class NotepadContentComponent implements OnInit, AfterViewInit {
  public organisationId?: string;
  public opportunityId?: string;

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  @ViewChild('windowTitleBarRef', { static: true })
  public windowTitleBarRef: TemplateRef<unknown>;

  @ViewChild(NotepadFormComponent)
  public notepadFormComponent: NotepadFormComponent;

  @ViewChild('maximizeButton', { read: WindowMaximizeActionDirective })
  public maximizeButton: WindowMaximizeActionDirective;

  protected templateFacade = inject(TemplatesStoreFacade);
  protected noteFacade = inject(NoteStoreFacade);
  protected store = inject(Store);
  protected actions$ = inject(Actions);
  protected windowRef = inject(WindowRef, { optional: true });
  protected dialogService = inject(DialogService);
  protected imagePathDictionaryService = inject(ImagePathDictionaryService);

  protected maximizedOnInit = false;
  protected maximizeOnInit = false;

  //TODO: MOVE TO COMPONENT STORE
  protected defaultTemplate = this.templateFacade.defaultTemplate;
  protected isCreatePending = this.noteFacade.isCreatingNote;
  protected router = inject(Router);
  public newTabIcon = exportIcon;
  public icon = xIcon;

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

    this.store
      .select(selectQueryParam('fullscreen'))
      .subscribe((fullscreen) => {
        this.maximizeOnInit = !!fullscreen;
      });
  }

  public constructor() {
    this.store.dispatch(TemplateActions.getTemplateIfNotLoaded());
  }

  ngAfterViewInit(): void {
    if (this.maximizeOnInit) {
      this.maximizeButton?.onClick?.();
    }
  }

  public onNewTabClick($event: Event): void {
    const firstDelimeter = window.location.search?.length ? '&' : '?';
    let newTabLink = `${window.location.toString()}${firstDelimeter}note-create=true&fullscreen=true`;

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
            window.open(
              newTabLink,
              '_blank',
              'resizable=yes, toolbar=no, scrollbars=yes, menubar=no, status=yes, directories=no, location=no, width=1000, height=600, left=0 top=100 ',
            );
            this.closeWindow();
          }
        });
    } else {
      window.open(
        newTabLink,
        '_blank',
        'resizable=yes, toolbar=no, scrollbars=yes, menubar=no, status=yes, directories=no, location=no, width=1000, height=600, left=0 top=100 ',
      );
      this.closeWindow();
    }
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
              'note-create': null,
            },
            queryParamsHandling: 'merge',
          });
        } else {
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
              'note-edit': null,
              'note-create': null,
              fullscreen: null,
            },
            queryParamsHandling: 'merge',
          });
        }
        this.windowRef?.close();
      });
  }

  protected closeWindow(): void {
    this.windowRef?.close();
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        fullscreen: null,
        'note-create': null,
      },
      queryParamsHandling: 'merge',
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
            this.closeWindow();
          }
        });
    } else {
      this.closeWindow();
    }
  }
}

export const componentDataResolver = (data: ComponentData): unknown => {
  return {
    organisationId: data?.['organisationId'],
    opportunityId: data?.['opportunityId'],
  };
};
