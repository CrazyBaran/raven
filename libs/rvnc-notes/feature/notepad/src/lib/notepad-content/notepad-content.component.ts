import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormRecord } from '@angular/forms';
import { ComponentData } from '@app/rvnc-dynamic-renderer/data-access';
import { NoteStoreFacade } from '@app/rvnc-notes/data-access';
import {
  DropdownTag,
  NotepadComponent,
  TagComponent,
  TagDropdownComponent,
  TagFormComponent,
} from '@app/rvnc-notes/ui';

import { TagsStoreFacade } from '@app/rvnc-tags/state';
import { TemplatesStoreFacade } from '@app/rvnc-templates/data-access';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { Actions, ofType } from '@ngrx/effects';
import {
  DialogModule,
  DialogService,
  WindowModule,
  WindowRef,
} from '@progress/kendo-angular-dialog';
import {
  DropDownListModule,
  DropDownTreesModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';

import { OnResizeDirective } from '@app/rvnc-notes/util';
import { DynamicControl } from '@app/rvnc-shared/dynamic-form';
import { TagData } from '@app/rvns-tags';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';
import { filter, map, of, startWith, switchMap, take } from 'rxjs';
import { NotesActions } from '../../../../../data-access/src/lib/+state/notes.actions';

@Component({
  selector: 'app-notepad-content',
  standalone: true,
  imports: [
    CommonModule,
    NotepadComponent,
    WindowModule,
    OnResizeDirective,
    EditorModule,
    DropDownListModule,
    DropDownTreesModule,
    MultiSelectModule,
    DialogModule,
    TagDropdownComponent,
    TagComponent,
    CheckBoxModule,
    LoaderModule,
  ],
  templateUrl: './notepad-content.component.html',
  styleUrls: ['./notepad-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class NotepadContentComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  protected templateFacade = inject(TemplatesStoreFacade);
  protected tagFacade = inject(TagsStoreFacade);
  protected noteFacade = inject(NoteStoreFacade);
  protected actions$ = inject(Actions);
  protected windowRef = inject(WindowRef);

  //TODO: MOVE TO COMPONENT STORE
  protected templates = this.templateFacade.templates;
  protected defaultTemplate = this.templateFacade.defaultTemplate;
  protected templateLoaded = this.templateFacade.loaded;
  protected tagLoaded = this.tagFacade.loaded;
  protected tags = this.tagFacade.allTagsWithCompanyRelation;
  protected isCreatePending = this.noteFacade.isCreatingNote;

  protected peopleTags = this.tagFacade.peopleTags;

  protected templateDropdownConfig = {
    textField: 'name',
    valueField: 'id',
  };

  protected fb = inject(FormBuilder);
  protected notepadForm = this.fb.group({
    template: [],
    notes: new FormRecord<FormControl<string | null>>({}),
    peopleTags: new FormControl([] as string[]),
  });

  protected selectedTemplateId$ =
    this.notepadForm.controls.template.valueChanges.pipe(
      startWith(this.notepadForm.controls.template.value),
      map((template: TemplateWithRelationsData | null) => template?.id ?? ''),
    );

  protected selectedPeopleTagsIds = toSignal(
    this.notepadForm.controls.peopleTags.valueChanges.pipe(
      startWith(this.notepadForm.controls.peopleTags.value),
    ),
  );

  protected selectedPeopleTags = computed(() => {
    const selected = this.selectedPeopleTagsIds() ?? [];
    return (this.peopleTags() ?? []).filter((t) => selected.includes(t.id));
  });

  protected peopleTagsWithoutSelected = computed(() => {
    const selected = this.selectedPeopleTagsIds() ?? [];
    return (this.peopleTags() ?? []).map((t) => ({
      ...t,
      checked: selected.includes(t.id),
    }));
  });

  protected selectedTemplateId = toSignal(this.selectedTemplateId$);

  protected selectedTemplate$ = this.selectedTemplateId$.pipe(
    switchMap((id) => (id ? this.templateFacade.template$(id) : of(undefined))),
  );

  protected addedTags: TagData[] = [];

  protected templateLoading = toSignal(this.templateFacade.isLoading$);

  protected selectedTemplate = toSignal(this.selectedTemplate$);

  protected config = computed((): Dictionary<DynamicControl> => {
    const template = this.isDefaultTemplate()
      ? this.defaultTemplate()
      : this.selectedTemplate();

    // Object.keys(this.notepadForm.controls.notes.controls).forEach((key) => {
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   (this.notepadForm.controls.notes as any).removeControl(key);
    // });

    if (template) {
      return _.chain(template.fieldGroups)
        .flatMap((group) => group.fieldDefinitions)
        .orderBy('order')
        .keyBy('id')
        .value() as unknown as Dictionary<DynamicControl>; //TODO: fix typing
    }

    return {};
  });

  protected isDefaultTemplate = computed(
    () =>
      !this.selectedTemplateId() ||
      this.selectedTemplateId() === this.defaultTemplate().id,
  );

  protected dialogService = inject(DialogService);

  protected defaultPerson = { text: 'Choose Person', id: 0 };

  public get hasChanges(): boolean {
    return (
      _.values(this.notepadForm.controls.notes.value).some(Boolean) ||
      this.addedTags.length > 0
    );
  }

  public ngOnInit(): void {
    this.templateFacade.getTemplatesIfNotLoaded();
    if (!this.tagFacade.loaded()) {
      this.tagFacade.init();
    }
  }

  public submit(): void {
    const fields = Object.entries(this.notepadForm.controls.notes.value)
      .filter(([key, value]) => key !== 'TITLE')
      .map(([id, value]) => ({ id, value: value || '' }));
    const payload = {
      name: this.notepadForm.controls.notes.get('TITLE')!.value!,
      templateId: this.selectedTemplateId() || this.defaultTemplate().id,
      fields: fields,
      tagIds: [
        ...(this.selectedPeopleTagsIds() ?? []),
        ...this.addedTags
          .map((tag) => tag.id)
          .map((t) => t.replace('_company', '')), //TODO: REFACTOR SUBMIT()
      ],
    };

    this.noteFacade.createNote(payload);

    this.actions$
      .pipe(
        ofType(NotesActions.createNoteSuccess),
        filter(({ data }) => data.name === payload.name),
        take(1),
      )
      .subscribe(() => this.windowRef?.close());
  }

  public openTagDialog($event: { type: string; search: string }): void {
    const dialogRef = this.dialogService.open({
      content: TagFormComponent,
      appendTo: this.containerRef,
    });

    dialogRef.content.instance.inputData = $event;

    dialogRef.result.subscribe((result) => {
      if ('submitted' in result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tag = result.submitted as any;
        const x = {
          type: 'type' in tag ? tag.type : '',
          name: 'name' in tag ? tag.name : '',
        };

        this.tagFacade.createTag(x);
      }
    });
  }

  public addTag($event: DropdownTag): void {
    this.addedTags.push($event);
  }

  public removeTag(tag: { name: string; type: string }): void {
    this.addedTags = this.addedTags.filter((t) => t.name !== tag.name);
  }

  public togglePerson(dataItem: TagData): void {
    const addedPeople = this.notepadForm.controls.peopleTags.value || [];

    if (addedPeople.includes(dataItem.id)) {
      this.removePeople(dataItem);
    } else {
      this.notepadForm.controls.peopleTags.setValue([
        ...addedPeople,
        dataItem.id,
      ]);
    }
  }

  public removePeople(tag: TagData): void {
    const addedPeople = this.notepadForm.controls.peopleTags.value || [];

    this.notepadForm.controls.peopleTags.setValue(
      addedPeople.filter((t) => t !== tag.id),
    );
  }
}

export const componentDataResolver = (data: ComponentData): unknown => {
  return {};
};
