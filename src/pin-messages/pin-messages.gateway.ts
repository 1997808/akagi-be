import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { PinMessagesService } from './pin-messages.service';
import { CreatePinMessageDto } from './dto/create-pin-message.dto';
import { AuthService } from '../auth/auth.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class PinMessagesGateway {
  constructor(
    private readonly pinMessagesService: PinMessagesService,
    private readonly authService: AuthService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('createPinMessage')
  async create(
    @MessageBody() createPinMessageDto: CreatePinMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    // todo check user in channel and roles
    // todo check message in channel
    return await this.pinMessagesService.create(
      this.server,
      createPinMessageDto,
    );
  }

  @SubscribeMessage('removePinMessage')
  async remove(@MessageBody() id: number, @ConnectedSocket() socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    // todo check message in channel
    return await this.pinMessagesService.remove(this.server, id);
  }
}
