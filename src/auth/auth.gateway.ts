import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class AuthGateway implements OnGatewayConnection {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer() private server: Server;

  async handleConnection(socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    if (!user) {
      return;
    }
    this.authService.handleUserOnline(socket, user.id);
  }
  async handleDisconnect(socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    if (!user) {
      return;
    }
    this.authService.handleUserDisconnect(socket, user.id);
  }

  @SubscribeMessage('loginSuccess')
  async listenUserMessage(@ConnectedSocket() socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    await socket.join(`${user.id}`);
    // this.server.to(`${user.id}`).emit('JOIN_USER_OK');
    this.server
      .to(`${user.id}`)
      .emit('ALL_USER_ONLINE', this.authService.getAllOnlineUser());
  }

  @SubscribeMessage('logout')
  async logoutUser(@ConnectedSocket() socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    if (user) socket.disconnect();
  }
}
