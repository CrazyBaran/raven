import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from '../rvn-auth/auth.module';
import { GatewayEventService } from './gateway/gateway-event.service';
import { GatewayService } from './gateway/gateway.service';
import { SocketProvider } from './socket/socket.provider';
import { SocketService } from './socket/socket.service';

@Module({
  imports: [EventEmitterModule.forRoot(), AuthModule],
  providers: [
    GatewayService,
    GatewayEventService,
    SocketProvider,
    SocketService,
  ],
  exports: [GatewayEventService],
})
export class WebSocketsModule {}
