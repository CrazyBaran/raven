import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

import {
  MsalInterceptor,
  MsalModule,
  MsalRedirectComponent,
  ProtectedResourceScopes,
} from '@azure/msal-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ErrorInterceptor, RvncAuthModule } from '@app/rvnc-auth';
import { ENVIRONMENT } from '@app/rvnc-environment';

import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { ProxyInterceptor } from './core/interceptors/proxy.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonsModule,
    AppRoutingModule,
    RvncAuthModule,
    ReactiveFormsModule,
    NotificationModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.adClientId,
          authority: environment.adAuthority,
          redirectUri: environment.adRedirectUri,
          postLogoutRedirectUri: environment.adPostLogoutRedirectUri,
          navigateToLoginRequestUrl: true,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false, // Set to true for Internet Explorer 11
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read'],
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map<
          string,
          Array<string | ProtectedResourceScopes> | null
        >([
          [
            `${environment.apiUrl}/*`,
            ['https://raven.test.mubadalacapital.ae/api'],
          ],
        ]),
      },
    ),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    WindowModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    AppRoutingModule,
    { provide: HTTP_INTERCEPTORS, useClass: ProxyInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    { provide: ENVIRONMENT, useValue: environment },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
