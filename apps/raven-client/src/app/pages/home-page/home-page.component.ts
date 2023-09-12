import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  public constructor(
    private readonly loaderService: LoaderService,
    private readonly store: Store,
  ) {}
}
