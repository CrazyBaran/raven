import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { ComponentData } from '@app/rvnc-dynamic-renderer/data-access';
import { NotepadComponent } from '@app/rvnc-notes/ui';
import { DynamicControl, OnResizeDirective } from '@app/rvnc-notes/util';
import { TemplatesStoreFacade } from '@app/rvnc-templates/data-access';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { DialogModule, WindowModule } from '@progress/kendo-angular-dialog';
import {
  DropDownListModule,
  DropDownTreesModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';
import { map, of, startWith, switchMap } from 'rxjs';

const defaultTemplate: Record<string, DynamicControl> = {
  title: {
    id: 'title',
    type: 'input',
    name: 'Note Title',
    order: 1,
  },
  note: {
    id: 'description',
    name: 'Note',
    type: 'richText',
    order: 2,
    grow: true,
  },
};

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
  ],
  templateUrl: './notepad-content.component.html',
  styleUrls: ['./notepad-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class NotepadContentComponent implements OnInit {
  protected templateFacade = inject(TemplatesStoreFacade);

  protected templates = toSignal(this.templateFacade.templates$);

  protected templateDropdownConfig = {
    textField: 'name',
    valueField: 'id',
  };

  protected defaultTemplate = {
    name: 'Choose Template',
    id: '',
  } as unknown as TemplateWithRelationsData;

  protected fb = inject(FormBuilder);
  protected notepadForm = this.fb.group({
    template: [this.defaultTemplate],
    notes: this.fb.group({}),
  });

  protected selectedTemplateId$ =
    this.notepadForm.controls.template.valueChanges.pipe(
      startWith(this.notepadForm.controls.template.value),
      map((template: TemplateWithRelationsData | null) => template?.id ?? ''),
    );

  protected selectedTemplateId = toSignal(this.selectedTemplateId$);

  protected selectedTemplate$ = this.selectedTemplateId$.pipe(
    switchMap((id) => (id ? this.templateFacade.template$(id) : of(undefined))),
  );

  protected selectedTemplate = toSignal(this.selectedTemplate$);

  protected config = computed((): Dictionary<DynamicControl> => {
    const template = this.selectedTemplate();

    if (template) {
      return _.chain(template.fieldGroups)
        .flatMap((group) => group.fieldDefinitions)
        .orderBy('order')
        .keyBy('id')
        .value() as unknown as Dictionary<DynamicControl>; //TODO: fix typing
    }

    return defaultTemplate;
  });
  protected isDefaultTemplate = computed(
    () => this.selectedTemplateId() === this.defaultTemplate.id,
  );

  protected defaultTag = { text: 'Choose Tag', id: 0 };
  protected defaultPerson = { text: 'Choose Person', id: 0 };

  public ngOnInit(): void {
    this.templateFacade.getTemplates();
  }
}

export const componentDataResolver = (data: ComponentData): unknown => {
  return {};
};
