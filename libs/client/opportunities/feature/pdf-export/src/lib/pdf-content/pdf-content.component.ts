import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { NotesTableComponent } from '@app/client/notes/ui';
import {
  ButtongroupNavigationComponent,
  DropdownNavigationComponent,
} from '@app/client/shared/ui-router';
import { Store } from '@ngrx/store';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import * as _ from 'lodash';
import { ImagePathDictionaryService } from '../../../../../../shared/storage/data-access/src';
import { NoteHeatmapFieldComponent } from '../../../../../ui/src';
import { pdfFieldsConfig } from '../pdf-export/pdf-export.config';
import { selectPDFExportModel } from '../pdf-export/pdf-export.selectors';
import {
  PDFExportBaseField,
  PDFExportConfiguration,
} from '../pdf-export/pdf-export.types';

@Component({
  selector: 'app-pdf-content',
  standalone: true,
  imports: [
    ButtonGroupModule,
    RxFor,
    ButtonModule,
    DropDownListModule,
    RxLet,
    RxIf,
    NotesTableComponent,
    RouterLink,
    RouterOutlet,
    NgIf,
    ButtongroupNavigationComponent,
    DropdownNavigationComponent,
    NoteHeatmapFieldComponent,
    CommonModule,
  ],
  templateUrl: './pdf-content.component.html',
  styleUrls: ['./pdf-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None,
})
export class PDFContentComponent {
  protected store = inject(Store);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected trackByFn = (index: number, item: any): string => item.id;
  protected vm = this.store.selectSignal(selectPDFExportModel);

  pathResolver = inject(ImagePathDictionaryService);

  protected imagePathDictionaryService = inject(ImagePathDictionaryService);

  public config: PDFExportConfiguration = pdfFieldsConfig;

  constructor(private readonly sanitizer: DomSanitizer) {}

  public getHtml(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  public isHeatmap(section: any): boolean {
    if (section?.heatmapFields?.length) {
      return true;
    }
    return false;
  }

  public prepareURL(domain: string | null): string {
    if (!domain) {
      return 'javascript:void';
    }
    return `https://${domain}`;
  }

  public getObjectValue(key: PDFExportBaseField): string | null {
    let finalValue: string | string[] | null = _.get(
      this.vm(),
      key.value.replacementValue,
    );
    if (!finalValue) {
      return null;
    }

    if (Array.isArray(finalValue)) {
      return finalValue.join('; ');
    }

    return key.value.value.replace('{{value}}', finalValue);
  }
}
