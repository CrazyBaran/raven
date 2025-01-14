import { io, Socket } from 'socket.io-client';

import { Injectable } from '@angular/core';

import { distinctUntilChangedDeep, log } from '@app/client/shared/util-rxjs';
import { WebsocketEvent, WebsocketResourceType } from '@app/rvns-web-sockets';
import { BehaviorSubject, filter, Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private socket: Socket;
  private events$: Subject<WebsocketEvent> = new Subject();

  private reconnectEvents$: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );

  private authErrorEvents$: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );

  public connect(wsUrl: string, token?: string): void {
    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      query: {
        auth: 'token', // TODO handle auth later
      },
    });

    this.socket.on('Unauthorized access, disconnecting...', () => {
      console.log('Unauthorized access');
      this.authErrorEvents$.next(true);
    });

    this.socket.on('events', (message: string) => {
      console.log('message', message);
      this.events$.next(JSON.parse(message));
    });

    this.socket.on('connect', () => {
      console.log('connected');
      this.reconnectEvents$.next(false);
      this.authErrorEvents$.next(false);
    });

    this.socket.on('reconnect_attempt', () => {
      console.log('reconnect_attempt');
    });

    this.socket.on('reconnect', () => {
      console.log('reconnect');
    });

    this.socket.on('disconnect', async (message: Socket.DisconnectReason) => {
      console.log('disconnected', message);
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
      console.log('disconnect');
      this.socket.disconnect();
    }
  }

  public joinResourcesEvents(resourceIds: Array<WebsocketResourceType>): void {
    console.log('join resources Id', resourceIds);
    this.socket.emit('ws.join.resources', resourceIds);
  }

  public leaveResourcesEvents(resourceIds: Array<WebsocketResourceType>): void {
    this.socket.emit('ws.leave.resources', resourceIds);
  }

  public events(): Observable<WebsocketEvent> {
    return this.events$.asObservable();
  }

  public eventsOfType<
    T extends WebsocketEvent['eventType'],
    TEvent extends Extract<WebsocketEvent, { eventType: T }>,
  >(eventType: T): Observable<TEvent> {
    return this.events$.pipe(
      log({ message: 'GET MESSAGE:' }),
      distinctUntilChangedDeep(),
      filter((event) => event.eventType === eventType),
    ) as Observable<TEvent>;
  }

  public reconnectEffects(): Observable<boolean> {
    return this.reconnectEvents$.asObservable();
  }

  public authErrorEffects(): Observable<boolean> {
    return this.authErrorEvents$.asObservable();
  }

  public connected(): boolean {
    return this.socket?.connected ?? false;
  }
}
