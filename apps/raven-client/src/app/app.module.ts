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

// Extract auth store to a separate library
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ErrorInterceptor, RvncAuthModule } from '@app/client/core/auth';

import { RouterModule } from '@angular/router';
import { ENVIRONMENT } from '@app/client/core/environment';
import { provideNotifications } from '@app/client/shared/util-notifications';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DialogModule } from '@progress/kendo-angular-dialog';
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
        >([[`${environment.apiUrl}/*`, [environment.adScope]]]),
      },
    ),
    StoreModule.forRoot({
      router: routerReducer,
    }),
    RouterModule.forRoot([], {
      paramsInheritanceStrategy: 'always',
    }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    DialogModule,
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
    provideNotifications(),
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
