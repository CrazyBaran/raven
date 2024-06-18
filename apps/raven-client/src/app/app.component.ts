import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
} from '@azure/msal-browser';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  public get isDarkMode(): boolean {
    return localStorage.getItem('isDarkMode') === 'true';
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeUnload($event: BeforeUnloadEvent): void {
    $event?.preventDefault();

    // Deprecated, but included for legacy support, e.g. Chrome/Edge < 119
    if ($event) {
      $event.returnValue = true;
    }
  }

  public ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS,
        ),
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
      });
  }
}
