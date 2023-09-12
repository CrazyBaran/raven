import { Server } from 'socket.io';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketProvider {
  private socket: Server;
  private initialized = false;

  public setSocket(socket: Server): void {
    this.socket = socket;
    this.initialized = true;
  }

  public getSocket(): Server {
    if (this.initialized === false) {
      throw new Error('Socket is not initialized');
    }
    return this.socket;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }
}
