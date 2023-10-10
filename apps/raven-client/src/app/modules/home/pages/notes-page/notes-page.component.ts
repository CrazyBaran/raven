import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageLayoutComponent } from '../../../../components/page-layout/page-layout.component';
import { UnderConstructionComponent } from '../under-construction/under-construction.component';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, UnderConstructionComponent, PageLayoutComponent],
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.scss'],
})
export class NotesPageComponent {}
