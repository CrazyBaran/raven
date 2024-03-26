import { trigger } from '@angular/animations';
import { JsonPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import {
  TagComponent,
  UserTagDirective,
  delayedFadeIn,
} from '@app/client/shared/ui';
import {
  OpenInNewTabDirective,
  RecreateViewDirective,
} from '@app/client/shared/ui-directives';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { BodyModule } from '@progress/kendo-angular-treelist';
import { RxLet } from '@rx-angular/template/let';
import { relatedFilesStore } from './related-files.store';

@Component({
  selector: 'app-related-files',
  standalone: true,
  imports: [
    JsonPipe,
    GridModule,
    BodyModule,
    ButtonModule,
    RxLet,
    TagComponent,
    UserTagDirective,
    RecreateViewDirective,
    OpenInNewTabDirective,
  ],
  templateUrl: './related-files.component.html',
  styleUrl: './related-files.component.scss',
  providers: [relatedFilesStore],
  animations: [trigger('delayedFadeIn', delayedFadeIn())],
})
export class RelatedFilesComponent {
  public relatedFiles = inject(relatedFilesStore);

  public directoryUrl = input.required<string>();
  public currentTab = input.required<string>();
  public fileTagDictionary =
    input.required<Record<string, { name: string }[]>>();

  public constructor() {
    this.relatedFiles.setDirectoryUrl(this.directoryUrl);
    this.relatedFiles.setCurrentTab(this.currentTab);
    this.relatedFiles.setFileTagDictionary(this.fileTagDictionary);
    this.relatedFiles.loadAllFiles(this.directoryUrl);
  }
}
