import { Socket } from 'socket.io';

import { WebsocketEvent } from '@app/rvns-web-sockets';

import { Injectable } from '@nestjs/common';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class GatewayEventService {
  public constructor(private readonly appSocketService: SocketService) {}

  public emit(roomId: string, event: WebsocketEvent, client?: Socket): boolean {
    const emitter = client ?? this.appSocketService.getSocket().to(roomId);
    return emitter.emit('events', JSON.stringify(event));
  }
}
