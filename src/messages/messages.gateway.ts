import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class MessagesGateway {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() private server: Server;

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const message = await this.messagesService.create(user, createMessageDto);
    return this.server
      .to(`CHANNEL_ACTIVE_${message.channelId}`)
      .emit('MESSAGE_CREATED', message);
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }
}
