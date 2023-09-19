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
} from '@azure/msal-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ErrorInterceptor, RvncAuthModule } from '@app/rvnc-auth';
import { ENVIRONMENT } from '@app/rvnc-environment';

import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';
import { BadGatewayComponent } from './pages/bad-gateway/bad-gateway.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

import { MainContainerComponent } from './components/main-container/main-container.component';

import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { ProxyInterceptor } from './core/interceptors/proxy.interceptor';
import { LoginComponent } from './pages/login/login.component';

const protectedResourceMap = new Map<string, Array<string>>();

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MainContainerComponent,
    AccessDeniedPageComponent,
    BadGatewayComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonsModule,
    AppRoutingModule,
    RvncAuthModule,
    ReactiveFormsModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.adClientId,
          authority: environment.adAuthority,
          redirectUri: environment.adRedirectUri,
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
        protectedResourceMap,
      },
    ),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
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
