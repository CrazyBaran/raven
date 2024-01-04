import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LogoComponent } from '../under-construction/logo.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, LogoComponent, DialogModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {}
