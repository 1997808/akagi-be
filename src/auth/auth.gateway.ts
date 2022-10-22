import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class AuthGateway {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer() private server: Server;

  @SubscribeMessage('loginSuccess')
  async listenUserMessage(@ConnectedSocket() socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    await socket.join(`${user.id}`);
    this.server.to(`${user.id}`).emit('JOIN_USER_OK');
  }

  @SubscribeMessage('logout')
  async logoutUser(@ConnectedSocket() socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    if (user) socket.disconnect();
  }
}
