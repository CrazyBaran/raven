import { Server, Socket } from 'socket.io';

import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { SocketProvider } from '../socket/socket.provider';

@WebSocketGateway()
export class GatewayService implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  public constructor(
    private readonly appSocketProvider: SocketProvider,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: RavenLogger,
  ) {
    this.logger.setContext(GatewayService.name);
  }

  // @UseGuards(WsJoinResourceGuard)
  @SubscribeMessage('ws.join.resource')
  public async joinResource(
    @MessageBody() resourceId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const rooms = Array.from(client.rooms);
    for (const room of rooms) {
      if (room !== client.id) {
        await client.leave(room);
      }
    }
    // resource room
    await client.join(`resource-${resourceId}`);
    this.logger.debug(`Client joined resource room: ${resourceId}`);
    this.eventEmitter.emit('ws.message.join-resource', {
      client,
      resourceId,
    });
  }

  @SubscribeMessage('ws.leave.resource')
  public async leaveResource(
    @MessageBody() resourceId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // resource room
    await client.leave(`resource-${resourceId}`);
    this.logger.debug(`Client left resource room: ${resourceId}`);
  }

  public afterInit(server: Server): void {
    this.logger.debug(`Socket server initialized`);
    this.appSocketProvider.setSocket(server);
  }

  public async handleConnection(client: Socket): Promise<void> {
    const jwtToken = client.handshake.query['auth'];
    if (typeof jwtToken === 'string') {
      // TODO add authentication!!!
      return;
      // try {
      //   this.authService.verifyJwt(jwtToken);
      //   this.logger.debug(`Client connected with id: ${client.id}`);
      //   return;
      // } catch (err) {
      //   // it doesn't make sense to log anything here - the error might spam
      // }
    }
    // disconnect the client (unauthorized)
    client.emit('Unauthorized access, disconnecting...');
    client.disconnect(true);
  }
}
