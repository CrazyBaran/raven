import { CommonModule, KeyValue } from '@angular/common';
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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ControlInjectorPipe,
  DynamicControl,
  DynamicControlFocusHandler,
  comparatorFn,
} from '@app/rvnc-notes/util';
import { DynamicControlResolver } from '../dynamic-control-resolver.service';
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
  ],
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynamicControlFocusHandler],
})
export class NotepadComponent implements OnInit {
  @Input() public notepadFormGroup = new FormGroup({});
  @Input() public hideTabs = false;

  protected formConfig: WritableSignal<Record<string, DynamicControl>> = signal(
    {},
  );

  protected state = signal({
    activeTabId: null as string | null,
    disabledTabIds: [] as string[],
  });

  protected controlResolver = inject(DynamicControlResolver);
  protected readonly comparatorFn = comparatorFn;
  protected dynamicControlFocusHandler = inject(DynamicControlFocusHandler);

  protected tabs = computed(() => {
    const formConfig = this.formConfig();
    return Object.keys(formConfig).map(
      (key): Tab => ({
        id: key,
        label: formConfig[key].name,
        state: (this.state().disabledTabIds.includes(key)
          ? 'disabled'
          : this.state().activeTabId === key
          ? 'active'
          : 'default') as ScrollTabState,
        canBeDisabled: this.formConfig()[key].order !== 1,
      }),
    );
  });

  protected visibleControls = computed(() => {
    const formConfig = this.formConfig();
    //remove disabled keys from object
    return Object.keys(formConfig).reduce(
      (acc, key) => {
        if (!this.state().disabledTabIds.includes(key)) {
          acc[key] = formConfig[key];
        }
        return acc;
      },
      {} as Record<string, DynamicControl>,
    );
  });

  @Input() public set config(value: Record<string, DynamicControl>) {
    this.formConfig.set(value);
  }

  public ngOnInit(): void {
    this.dynamicControlFocusHandler.focus$().subscribe((controlKey) => {
      this.state.update((state) => ({
        ...state,
        activeTabId: controlKey,
      }));
    });
  }

  public onSubmit(): void {
    //
  }

  public trackTabByFn(index: number, item: Tab): string {
    return item.id;
  }

  public toggleDisabled(tab: Tab, currentTabIndex: number): void {
    const isDisabled = this.state().disabledTabIds.includes(tab.id);

    //set as active the closest tab that are not disabled to the bottom or top if not exists
    if (tab.id === this.state().activeTabId) {
      const tabs = this.tabs();

      const nextTabs = tabs.slice(currentTabIndex + 1);
      const prevTabs = tabs.slice(0, currentTabIndex);

      const notDisabledNextTab = nextTabs.find(
        (t) => !this.state().disabledTabIds.includes(t.id),
      );
      const notDisabledPrevTab = prevTabs
        .reverse()
        .find((t) => !this.state().disabledTabIds.includes(t.id));

      this.setActiveTab(notDisabledNextTab || notDisabledPrevTab || tabs[0]);
    }

    if (isDisabled) {
      setTimeout(() => {
        this.setActiveTab(tab);
      }, 5);
    }

    this.state.update((state) => ({
      ...state,
      disabledTabIds: state.disabledTabIds.includes(tab.id)
        ? state.disabledTabIds.filter((id) => id !== tab.id)
        : [...state.disabledTabIds, tab.id],
    }));
  }

  public trackByFn(
    index: number,
    item: KeyValue<string, DynamicControl>,
  ): string {
    return item.key;
  }

  public setActiveTab(tab: { id: string }): void {
    this.dynamicControlFocusHandler.focusTo(tab.id);
  }
}
