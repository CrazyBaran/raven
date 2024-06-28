import { trigger } from '@angular/animations';
import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormRecord, ReactiveFormsModule } from '@angular/forms';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { NotesActions, notesQuery } from '@app/client/notes/state';
import {
  ControlInjectorPipe,
  DynamicControl,
  DynamicControlFocusHandler,
  DynamicControlResolver,
  comparatorFn,
} from '@app/client/shared/dynamic-form-util';
import { LoaderComponent, delayedFadeIn } from '@app/client/shared/ui';
import { Store } from '@ngrx/store';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxUnpatch } from '@rx-angular/template/unpatch';
import { Subject, map, merge } from 'rxjs';
import { NotepadTemplateComponent } from '../notepad-template/notepad-template.component';
import {
  ScrollTabComponent,
  ScrollTabState,
} from '../scroll-tab/scroll-tab.component';

export type Tab = {
  id: string;
  label: string;
  state: ScrollTabState;
  canBeDisabled: boolean;
};

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [
    CommonModule,
    ScrollTabComponent,
    ReactiveFormsModule,
    ControlInjectorPipe,
    NotepadTemplateComponent,
    RxFor,
    RxUnpatch,
    LoaderComponent,
    RxIf,
    NgClass,
  ],
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynamicControlFocusHandler],
  animations: [trigger('delayedFadeIn', delayedFadeIn())],
})
export class NotepadComponent implements OnInit {
  @Input() public notepadFormGroup = new FormRecord({});
  @Input() public hideTabs = false;

  protected formConfig: WritableSignal<Record<string, DynamicControl>> = signal(
    {},
  );

  protected activeTabId = signal<string | null>(null);

  protected store = inject(Store);
  protected controlResolver = inject(DynamicControlResolver);
  protected readonly comparatorFn = comparatorFn;
  protected dynamicControlFocusHandler = inject(DynamicControlFocusHandler);

  protected readonly disabledNoteTabs = this.store.selectSignal(
    notesQuery.selectDisabledNoteTabs,
  );

  protected tabs = computed(() => {
    const formConfig = this.formConfig();
    return Object.keys(formConfig).map(
      (key): Tab => ({
        id: key,
        label: formConfig[key].name,
        state: (this.isDisabled(key)
          ? 'disabled'
          : this.activeTabId() === key
            ? 'active'
            : 'default') as ScrollTabState,
        canBeDisabled: this.formConfig()[key].id !== 'TITLE',
      }),
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected itemsRendered = new Subject<any[]>();
  protected startRender = new Subject<void>();

  protected visible = toSignal(
    merge(
      this.startRender.pipe(map(() => false)),
      this.itemsRendered.pipe(map(() => true)),
    ),
  );

  @Input() public set config(value: Record<string, DynamicControl>) {
    this.startRender.next();
    this.formConfig.set({
      ...value,
    });
  }

  public ngOnInit(): void {
    this.dynamicControlFocusHandler.focus$().subscribe((controlKey) => {
      this.activeTabId.set(controlKey);
    });
  }

  public toggleDisabled(tab: Tab, currentTabIndex: number): void {
    //set as active the closest tab that are not disabled to the bottom or top if not exists
    if (tab.id === this.activeTabId()) {
      const tabs = this.tabs();

      const nextTabs = tabs.slice(currentTabIndex + 1);
      const prevTabs = tabs.slice(0, currentTabIndex);

      const notDisabledNextTab = nextTabs.find((t) => !this.isDisabled(t.id));
      const notDisabledPrevTab = prevTabs
        .reverse()
        .find((t) => !this.isDisabled(t.id));

      this.setActiveTab(notDisabledNextTab || notDisabledPrevTab || tabs[0]);
    }

    if (this.isDisabled(tab.id)) {
      setTimeout(() => {
        this.setActiveTab(tab);
      }, 5);
    }

    this.store.dispatch(
      NotesActions.toggleDisabledNoteTabs({ id: tab.id, label: tab.label }),
    );
  }

  public isDisabled(id: string): boolean {
    return !!this.disabledNoteTabs().find((el) => el.id === id);
  }

  public setActiveTab(tab: { id: string }): void {
    this.dynamicControlFocusHandler.focusTo(tab.id);
  }

  protected setPreviousTabActive(): void {
    const tabs = this.tabs();
    const notDisabledTabs = tabs.filter((t) => !this.isDisabled(t.id));
    const currentTabIndex = tabs.findIndex((t) => t.id === this.activeTabId());
    const prevTabs = tabs.slice(0, currentTabIndex).reverse();
    const notDisabledPrevTab = prevTabs.find((t) => !this.isDisabled(t.id));
    this.setActiveTab(
      notDisabledPrevTab || notDisabledTabs[notDisabledTabs.length - 1],
    );
  }

  protected setNextTabActive(): void {
    const tabs = this.tabs();
    const currentTabIndex = tabs.findIndex((t) => t.id === this.activeTabId());
    const nextTabs = tabs.slice(currentTabIndex + 1);
    const notDisabledNextTab = nextTabs.find((t) => !this.isDisabled(t.id));
    this.setActiveTab(notDisabledNextTab || tabs[0]);
  }
}
