import { io, Socket } from 'socket.io-client';

import { Injectable } from '@angular/core';

import { WebsocketEvent } from '@app/rvns-web-sockets';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: Socket;
  private events$: Subject<WebsocketEvent> = new Subject();
  private reconnectEvents$: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );
  private authErrorEvents$: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );

  public connect(token?: string): void {
    this.socket = io(
      environment.apiUrl.endsWith('/api')
        ? environment.apiUrl.slice(0, -4)
        : environment.apiUrl,
      {
        transports: ['websocket', 'polling'],
        query: {
          auth: 'token', // TODO handle auth later
        },
      },
    );

    this.socket.on('Unauthorized access, disconnecting...', () => {
      this.authErrorEvents$.next(true);
    });

    this.socket.on('events', (message: string) => {
      console.log('message', message);
      this.events$.next(JSON.parse(message));
    });

    this.socket.on('connect', () => {
      this.reconnectEvents$.next(false);
      this.authErrorEvents$.next(false);
    });

    this.socket.on('disconnect', async (message: Socket.DisconnectReason) => {
      const reconnectMessages = [
        'ping timeout',
        'transport close',
        'transport error',
      ];

      if (reconnectMessages.includes(message)) {
        this.reconnectEvents$.next(true);
        return;
      }

      this.reconnectEvents$.next(false);
    });
  }

  public disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
  }

  public joinResourceEvents(resourceId: string): void {
    this.socket.emit('ws.join.resource', resourceId);
  }

  public leaveResourceEvents(resourceId: string): void {
    this.socket.emit('ws.leave.resource', resourceId);
  }

  public events(): Observable<WebsocketEvent> {
    return this.events$.asObservable();
  }

  public reconnectEffects(): Observable<boolean> {
    return this.reconnectEvents$.asObservable();
  }

  public authErrorEffects(): Observable<boolean> {
    return this.authErrorEvents$.asObservable();
  }
}
