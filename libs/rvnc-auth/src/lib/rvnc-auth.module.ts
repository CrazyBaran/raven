import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AuthEffects } from './+state/auth.effects';
import * as fromAuth from './+state/auth.reducer';

import { SsoComponent } from './pages/sso/sso.component';

import { RvncAuthRoutingModule } from './rvnc-auth-routing.module';
import { RvncAuthComponent } from './rvnc-auth.component';
import { AzureAdSsoComponent } from './components/azure-ad-sso/azure-ad-sso.component';

@NgModule({
  imports: [
    CommonModule,
    RvncAuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forFeature(fromAuth.AUTH_FEATURE_KEY, fromAuth.authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [RvncAuthComponent, SsoComponent, AzureAdSsoComponent],
})
export class RvncAuthModule {}
