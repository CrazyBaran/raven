import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LogoComponent } from '../under-construction/logo.component';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.scss'],
})
export class NotesPageComponent {}
