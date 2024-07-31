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
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import * as _ from 'lodash';
import { ImagePathDictionaryService } from '../../../../../../shared/storage/data-access/src';
import { NoteHeatmapFieldComponent } from '../../../../../ui/src';
import {
  PDFPageConfig,
  pdfFieldsConfig,
} from '../pdf-export/pdf-export.config';
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
    PDFExportModule,
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
  protected exportTime = new Date().getTime();
  pathResolver = inject(ImagePathDictionaryService);

  protected imagePathDictionaryService = inject(ImagePathDictionaryService);
  public pageConfig = PDFPageConfig;

  public config: PDFExportConfiguration = pdfFieldsConfig;

  constructor(private readonly sanitizer: DomSanitizer) {}

  public getHtml(value: string): SafeHtml {
    const hasImage = value?.indexOf('<img') > -1;
    if (!hasImage) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }

    const processedValue = this.scaleImagesToPageSize(value);

    return this.sanitizer.bypassSecurityTrustHtml(processedValue);
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

  public getPDFFileName(): string {
    return `${
      this.vm()?.organisation?.name || 'organisation'
    }-raven-briefing_materials-${this.exportTime}.pdf`;
  }

  public exportPreAction(): void {
    this.exportTime = new Date().getTime();
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

  protected scaleImagesToPageSize(value: string): string {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(value, 'text/html');
      const imgTags = doc.getElementsByTagName('img');
      let resizeExecuted = false;
      for (let i = 0; i < imgTags.length; i++) {
        if (imgTags[i].style.width) {
          const w = imgTags[i].style.width.split('px')[0];
          if (parseInt(w) > 485) {
            imgTags[i].style.width = `485px`;
            if (imgTags[i].style.height) {
              const h = imgTags[i].style.height.split('px')[0];
              const wPercentageDiff = 48500 / parseInt(w);

              imgTags[i].style.height = `${Math.floor(
                parseInt(h) * (wPercentageDiff / 100),
              )}px`;
            }
            resizeExecuted = true;
          }
        }
      }

      return resizeExecuted ? doc.body.innerHTML : value;
    } catch (e) {
      return value;
    }
  }
}
