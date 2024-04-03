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
  @SubscribeMessage('ws.join.resources')
  public async joinResource(
    @MessageBody() resourceIds: Array<string>,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const rooms = Array.from(client.rooms);
    for (const room of rooms) {
      if (![...resourceIds, client.id].includes(room)) {
        await client.leave(room);
      }
    }
    await client.join(
      resourceIds.map((resourceId) => `resource-${resourceId}`),
    );
    this.logger.debug(`Client joined resource rooms: ${resourceIds}`);
    this.eventEmitter.emit('ws.message.join-resource', {
      client,
      resourceIds,
    });
  }

  @SubscribeMessage('ws.leave.resources')
  public async leaveResource(
    @MessageBody() resourceIds: Array<string>,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    for (const resourceId of resourceIds) {
      await client.leave(`resource-${resourceId}`);
      this.logger.debug(`Client left resource room: ${resourceId}`);
    }
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
