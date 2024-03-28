import { Component } from '@angular/core';
import { SkeletonModule } from '@progress/kendo-angular-indicators';

@Component({
  selector: 'app-tag-skeleton',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './tag-skeleton.component.html',
  styleUrl: './tag-skeleton.component.scss',
})
export class TagSkeletonComponent {}
