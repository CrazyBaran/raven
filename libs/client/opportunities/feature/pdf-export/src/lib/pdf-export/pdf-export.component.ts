import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtongroupNavigationComponent } from '@app/client/shared/ui-router';
import { Store } from '@ngrx/store';
import {
  ButtonGroupModule,
  ButtonModule,
  ButtonsModule,
} from '@progress/kendo-angular-buttons';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { PDFContentComponent } from '../pdf-content/pdf-content.component';
import { PDFPageConfig } from './pdf-export.config';

@Component({
  selector: 'app-pdf-export',
  standalone: true,
  imports: [
    NgClass,
    ButtonGroupModule,
    RxFor,
    ButtonModule,
    RxLet,
    RxIf,
    ButtongroupNavigationComponent,
    PDFExportModule,
    PDFContentComponent,
    ButtonsModule,
  ],
  templateUrl: './pdf-export.component.html',
  styleUrls: ['./pdf-export.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PDFExportComponent {
  protected readonly defaultFilename = 'raven_opportunity-export';
  protected store = inject(Store);
  protected activatedRoute = inject(ActivatedRoute);
  protected exportTime: number;
  public exportPanelExpanded = signal<boolean>(false);
  public fileName = input<string>();
  public loading = input<boolean>();
  public config = PDFPageConfig;

  public getPDFFileName(): string {
    return `${this.fileName() ?? this.defaultFilename}-${this.exportTime}.pdf`;
  }

  public exportPreAction(): void {
    this.exportTime = new Date().getTime();
  }

  protected toggleExportPanelExpand(): void {
    this.exportPanelExpanded.update((expanded) => !expanded);
  }

  protected onCollapse(): void {
    this.exportPanelExpanded.set(false);
  }

  protected onExpand(): void {
    this.exportPanelExpanded.set(true);
  }
}
