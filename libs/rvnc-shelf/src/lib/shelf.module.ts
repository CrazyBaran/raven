import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { DialogsModule, WindowModule } from '@progress/kendo-angular-dialog';
import { ShelfStoreFacade } from './actions/shelf.store.facade';
import { RavenShelfService } from './raven-shelf.service';
import { ShelfEffects } from './shelf.effects';

@NgModule({
  declarations: [],
  imports: [
    WindowModule,
    DialogsModule,
    EffectsModule.forFeature([ShelfEffects]),
  ],
  exports: [],
  providers: [RavenShelfService, ShelfStoreFacade],
})
export class ShelfModule {}
