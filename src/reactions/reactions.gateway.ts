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
    const { emoji, unified, messageId, channelId } = createReactionDto;
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const reaction = await this.reactionsService.findOneDuplicate(
      createReactionDto,
    );
    const result = await this.reactionsService.countReactions(
      messageId,
      unified,
    );
    if (reaction) {
      await this.reactionsService.remove(reaction.id);
      if (result > 1) {
        return this.server
          .to(`CHANNEL_ACTIVE_${channelId}`)
          .emit('MESSAGE_REACTED', {
            messageId,
            new: false,
            data: {
              emoji,
              unified,
              _count: { _all: result - 1, emoji: result - 1 },
            },
          });
      } else {
        return this.server
          .to(`CHANNEL_ACTIVE_${channelId}`)
          .emit('MESSAGE_REMOVE_REACTED', {
            messageId,
            data: {
              emoji,
              unified,
            },
          });
      }
    }
    await this.reactionsService.create(createReactionDto);
    return this.server
      .to(`CHANNEL_ACTIVE_${channelId}`)
      .emit('MESSAGE_REACTED', {
        messageId,
        new: !(result > 0),
        data: {
          emoji,
          unified,
          _count: { _all: result + 1, emoji: result + 1 },
        },
      });
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

// interface ReactionProps {
//   emoji: string;
//   unified: string;
//   _count: ReactionCountProps;
// }

// interface ReactionCountProps {
//   _all: number;
//   emoji: number;
// }
