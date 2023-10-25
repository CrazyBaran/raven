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
import { DynamicControl } from '@app/rvnc-shared/dynamic-form';
import { ControlValueAccessor } from '@app/rvnc-shared/util';
import { TagsStoreFacade } from '@app/rvnc-tags/state';
import { TemplatesStoreFacade } from '@app/rvnc-templates/data-access';
import { TagData } from '@app/rvns-tags';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogService } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';
import { NotepadComponent } from '../notepad/notepad.component';
import { TagDropdownComponent } from '../tag-dropdown/tag-dropdown.component';
import { TagComponent } from '../tag/tag.component';

import { map, startWith } from 'rxjs';
import { TagFormComponent } from '../tag-form/tag-form.component';

export interface NotepadForm {
  template: TemplateWithRelationsData | null;
  notes: Dictionary<string | null>;
  peopleTags: string[];
  tags: string[];
  title?: string;
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
  public override writeValue(value: NotepadForm): void {
    this.notepadForm.patchValue(value, { onlySelf: true });
  }

  public constructor() {
    super();
    this.notepadForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.onChange?.(value as NotepadForm);
      });
  }

  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  protected templateFacade = inject(TemplatesStoreFacade);
  protected tagFacade = inject(TagsStoreFacade);

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

  // protected selectedTemplate$ = this.selectedTemplateId$.pipe(
  //   switchMap((id) => (id ? this.templateFacade.template$(id) : of(undefined))),
  // );

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
        const x = {
          type: 'type' in tag ? tag.type : '',
          name: 'name' in tag ? tag.name : '',
        };

        this.tagFacade.createTag(x);
      }
    });
  }

  public removeTag(tag: TagData): void {
    this.notepadForm.controls.tags.setValue(
      this.addedTagIds()?.filter((t) => t !== tag.id) ?? [],
    );
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
