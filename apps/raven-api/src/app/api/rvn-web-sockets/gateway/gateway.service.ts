import { Server, Socket } from 'socket.io';

import { UseGuards } from '@nestjs/common';
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
import { AuthService } from '../../rvn-auth/auth.service';
import { WsJoinResourceGuard } from '../../rvn-auth/guards/ws-join-resource.guard';
import { SocketProvider } from '../socket/socket.provider';
import { GatewayServiceLogger } from './gateway-service.logger';

@WebSocketGateway()
export class GatewayService implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  public constructor(
    private readonly appSocketProvider: SocketProvider,
    private readonly eventEmitter: EventEmitter2,
    private readonly authService: AuthService,
    private readonly logger: GatewayServiceLogger,
  ) {}

  @UseGuards(WsJoinResourceGuard)
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
    // user private resource room
    const jwtToken = (client.handshake.query['auth'] as string).toString();
    const userData = this.authService.decodeToken(jwtToken);
    if (userData) {
      await client.join(`resource-${resourceId}-user-${userData['id']}`);
      this.logger.debug(
        `Client joined private resource room: ${resourceId}#${userData['id']}`,
      );
    }
  }

  @SubscribeMessage('ws.leave.resource')
  public async leaveResource(
    @MessageBody() resourceId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // resource room
    await client.leave(`resource-${resourceId}`);
    this.logger.debug(`Client left resource room: ${resourceId}`);
    // user private resource room
    const jwtToken = (client.handshake.query['auth'] as string).toString();
    const userData = this.authService.decodeToken(jwtToken);
    if (userData) {
      await client.leave(`resource-${resourceId}-user-${userData['id']}`);
      this.logger.debug(
        `Client left private resource room: ${resourceId}#${userData['id']}`,
      );
    }
  }

  public afterInit(server: Server): void {
    this.appSocketProvider.setSocket(server);
  }

  public async handleConnection(client: Socket): Promise<void> {
    const jwtToken = client.handshake.query['auth'];
    if (typeof jwtToken === 'string') {
      try {
        this.authService.verifyJwt(jwtToken);
        this.logger.debug(`Client connected with id: ${client.id}`);
        return;
      } catch (err) {
        // it doesn't make sense to log anything here - the error might spam
      }
    }
    // disconnect the client (unauthorized)
    client.emit('Unauthorized access, disconnecting...');
    client.disconnect(true);
  }
}
