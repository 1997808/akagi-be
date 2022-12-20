import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { AuthService } from '../auth/auth.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ReactionsGateway {
  constructor(
    private readonly reactionsService: ReactionsService,
    private readonly authService: AuthService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('createReaction')
  async create(
    @MessageBody() createReactionDto: CreateReactionDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const reaction = await this.reactionsService.findOneDuplicate(
      createReactionDto,
    );
    if (reaction) {
      return this.reactionsService.remove(reaction.id);
    }
    return this.reactionsService.create(createReactionDto);
  }

  @SubscribeMessage('findOneReaction')
  async findOne(@MessageBody() id: number, @ConnectedSocket() socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    return this.reactionsService.findOne(id);
  }

  @SubscribeMessage('removeReaction')
  async remove(@MessageBody() id: number, @ConnectedSocket() socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    return this.reactionsService.remove(id);
  }
}
