import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageLayoutComponent } from '../../../../components/page-layout/page-layout.component';
import { LogoComponent } from '../under-construction/logo.component';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [CommonModule, LogoComponent, PageLayoutComponent],
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss'],
})
export class ContactsPageComponent {}
