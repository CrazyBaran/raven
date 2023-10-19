import { Server } from 'socket.io';

import { Injectable } from '@nestjs/common';
import { SocketProvider } from './socket.provider';

@Injectable()
export class SocketService {
  public constructor(private readonly appSocketProvider: SocketProvider) {}

  public getSocket(): Server {
    return this.appSocketProvider.getSocket();
  }
}
