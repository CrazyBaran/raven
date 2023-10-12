import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UnderConstructionComponent } from '../under-construction/under-construction.component';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, UnderConstructionComponent],
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.scss'],
})
export class NotesPageComponent {}
