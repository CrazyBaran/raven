import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import * as AuthEffects from './+state/auth.effects';
import * as fromAuth from './+state/auth.reducer';

import { SsoComponent } from './pages/sso/sso.component';

import { AzureAdSsoComponent } from './components/azure-ad-sso/azure-ad-sso.component';
import { RvncAuthRoutingModule } from './rvnc-auth-routing.module';
import { RvncAuthComponent } from './rvnc-auth.component';
import { UserService } from './services/user.service';

@NgModule({
  imports: [
    CommonModule,
    RvncAuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forFeature(fromAuth.AUTH_FEATURE_KEY, fromAuth.authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [UserService],
  declarations: [RvncAuthComponent, SsoComponent, AzureAdSsoComponent],
})
export class RvncAuthModule {}
