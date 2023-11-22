/* eslint-disable @nx/enforce-module-boundaries */
//TODO: refactor note form

/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormRecord,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TagDropdownComponent,
  TagFormComponent,
  TagsStoreFacade,
} from '@app/client/notes/api-tags';
import {
  DynamicControl,
  getSchemaWithCrossorigin,
  imageUploader,
} from '@app/client/shared/dynamic-form-util';
import { ControlValueAccessor } from '@app/client/shared/util';
import { TemplatesStoreFacade } from '@app/client/templates/data-access';
import { TagData } from '@app/rvns-tags';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogResult, DialogService } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';
import { NotepadComponent } from '../notepad/notepad.component';

import { UploadFileService } from '@app/client/shared/storage/data-access';
import { EditorView } from '@progress/kendo-angular-editor';

import { ProvideProseMirrorSettingsDirective } from '@app/client/shared/dynamic-form-util';
import { TagComponent } from '@app/client/shared/ui';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, startWith, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
export interface NotepadForm {
  template: TemplateWithRelationsData | null;
  notes: Dictionary<string | null>;
  peopleTags: string[];
  tags: string[];
  title?: string;
  rootVersionId?: string;
}

export const TITLE_FIELD: DynamicControl = {
  name: 'Note Title',
  id: 'TITLE',
  type: 'text',
  order: 0,
  validators: {
    required: true,
  },
};

@Component({
  selector: 'app-notepad-form',
  standalone: true,
  imports: [
    CommonModule,
    DropDownsModule,
    TagComponent,
    NotepadComponent,
    LoaderModule,
    TagDropdownComponent,
    ReactiveFormsModule,
    ButtonModule,
    CheckBoxModule,
    ProvideProseMirrorSettingsDirective,
  ],
  templateUrl: './notepad-form.component.html',
  styleUrls: ['./notepad-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NotepadFormComponent),
      multi: true,
    },
  ],
})
export class NotepadFormComponent
  extends ControlValueAccessor<NotepadForm>
  implements OnInit
{
  public defaultOriginId = uuidv4();

  public override writeValue(value: NotepadForm): void {
    this.notepadForm.patchValue(value, { onlySelf: true });
    this.standaloneTemplateForm.setValue(value.template, { emitEvent: false });
  }

  public constructor() {
    super();
    this.notepadForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.onChange?.(value as NotepadForm);
      });

    this.actions$
      .pipe(
        takeUntilDestroyed(),
        ofType(TagsActions.createTagSuccess),
        tap((tag) => {
          this.notepadForm.controls.tags.setValue([
            ...(this.notepadForm.controls.tags.value ?? []),
            tag.data.id,
          ]);
        }),
      )
      .subscribe();
  }

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  protected templateFacade = inject(TemplatesStoreFacade);
  protected tagFacade = inject(TagsStoreFacade);
  protected uploadFileService = inject(UploadFileService);
  protected store = inject(Store);
  protected actions$ = inject(Actions);

  //TODO: MOVE TO COMPONENT STORE
  protected noteTemplates = this.templateFacade.notesTemplates;
  protected defaultTemplate = this.templateFacade.defaultTemplate;
  protected templateLoaded = this.templateFacade.loaded;
  protected tagLoaded = this.tagFacade.loaded;
  protected tags = this.tagFacade.allTagsWithCompanyRelation;

  protected peopleTags = this.tagFacade.peopleTags;

  protected dropdownTemplates = computed(() => {
    return this.noteTemplates().filter(
      ({ id }) => id !== this.defaultTemplate()?.id,
    );
  });

  //todo move it to standlone component
  protected standaloneTemplateForm =
    new FormControl<TemplateWithRelationsData | null>(null);

  protected templateDropdownConfig = {
    textField: 'name',
    valueField: 'id',
  };

  protected fb = inject(FormBuilder);

  public notepadForm = this.fb.group({
    template: [null as TemplateWithRelationsData | null],
    notes: new FormRecord<FormControl<string | null>>({}),
    peopleTags: new FormControl([] as string[]),
    tags: new FormControl([] as string[]),
    title: new FormControl(''),
    rootVersionId: new FormControl(this.defaultOriginId),
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
    return (this.peopleTags() ?? [])
      .filter((t) => selected.includes(t.id))
      .filter(Boolean);
  });

  protected peopleTagsWithoutSelected = computed(() => {
    const selected = this.selectedPeopleTagsIds() ?? [];
    return (this.peopleTags() ?? []).map((t) => ({
      ...t,
      checked: selected.includes(t.id),
    }));
  });

  protected selectedTemplateId = toSignal(this.selectedTemplateId$);

  protected proseMirrorSettings = {
    schema: getSchemaWithCrossorigin(),
    plugins: [
      imageUploader({
        upload: async (fileOrUrl: File | string, view: EditorView) => {
          return await firstValueFrom(
            this.uploadFileService
              .uploadFile(
                fileOrUrl as File,
                this.notepadForm.controls.rootVersionId.value!,
              )
              .pipe(map((res) => res.data!.sasToken)),
          );
        },
      }),
    ],
  };

  protected selectedTemplate$ =
    this.notepadForm.controls.template.valueChanges.pipe(
      startWith(this.notepadForm.controls.template.value),
    );

  protected addedTagIds = toSignal(
    this.notepadForm.controls.tags.valueChanges.pipe(
      startWith(this.notepadForm.controls.tags.value),
    ),
  );

  protected addedTags = computed(() => {
    return (
      this.addedTagIds()
        ?.map((tagId) => this.tags().find((t) => t?.id === tagId) as TagData)
        .filter(Boolean) ?? []
    );
  });

  protected selectedTemplate = toSignal(this.selectedTemplate$);

  protected config = computed((): Dictionary<DynamicControl> => {
    const template = this.isDefaultTemplate()
      ? this.defaultTemplate()
      : this.selectedTemplate();

    const titleField = {
      [TITLE_FIELD.id]: {
        ...TITLE_FIELD,
        value: this.notepadForm.controls.title.value,
      },
    };

    if (template) {
      return {
        ...titleField,
        ...(_.chain(template.fieldGroups)
          .flatMap((group) => group.fieldDefinitions)
          .orderBy('order')
          .keyBy('id')
          .mapValues((field) => ({
            ...field,
          }))
          .value() as unknown as Dictionary<DynamicControl>),
      }; //TODO: fix typing
    }

    return titleField;
  });

  protected isDefaultTemplate = computed(
    () =>
      !this.selectedTemplateId() ||
      this.selectedTemplateId() === this.defaultTemplate().id,
  );

  protected dialogService = inject(DialogService);

  public ngOnInit(): void {
    this.templateFacade.getTemplatesIfNotLoaded();
    if (!this.tagFacade.loaded()) {
      this.tagFacade.init();
    }
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

        const form = {
          type: 'type' in tag ? tag.type : '',
          name: 'name' in tag ? tag.name : '',
          domain: 'domain' in tag ? tag.domain : '',
        };

        this.tagFacade.createTag(form);
      }
    });
  }

  public removeTag(tag: TagData): void {
    this.notepadForm.controls.tags.setValue(
      this.addedTagIds()?.filter((t) => t !== tag.id) ?? [],
    );
    this.notepadForm.controls.tags.markAsDirty();
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
    this.notepadForm.controls.peopleTags.markAsDirty();
  }

  public handleValueChange(value: TemplateWithRelationsData): void {
    const notes = this.notepadForm.controls.notes.value;

    if (Object.keys(notes).some((key) => notes[key])) {
      this.dialogService
        .open({
          appendTo: this.containerRef,
          title: 'Change template?',
          width: 350,
          content:
            'If you switch template, any progress you have made will be lost. Are you sure you want to continue?',
          actions: [
            { text: 'No' },
            {
              text: 'Yes, switch template',
              primary: true,
              themeColor: 'primary',
            },
          ],
        })
        .result.subscribe((res: DialogResult) => {
          if ('text' in res && res.text === 'Yes, switch template') {
            this.notepadForm.controls.template.setValue(value);
            this.standaloneTemplateForm.setValue(value, { emitEvent: false });
          }
        });

      this.standaloneTemplateForm.setValue(
        this.notepadForm.controls.template.value,
        { emitEvent: false },
      );
      return;
    }

    this.notepadForm.controls.template.setValue(value);
  }
}
