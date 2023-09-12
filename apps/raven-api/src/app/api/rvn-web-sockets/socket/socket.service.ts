import { Server } from 'socket.io';

import { SocketProvider } from './socket.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  public constructor(private readonly appSocketProvider: SocketProvider) {}

  public getSocket(): Server {
    return this.appSocketProvider.getSocket();
  }
}
